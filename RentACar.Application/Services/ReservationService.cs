using Hangfire;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.DTOs;
using RentACar.Application.Exceptions;
using RentACar.Application.BackgroundJobs;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;

namespace RentACar.Application.Services;

public class ReservationService : IReservationService
{
    private readonly IApplicationDbContext _context;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IDistributedLockService _distributedLockService;

    public ReservationService(IApplicationDbContext context, IBackgroundJobClient backgroundJobClient, IDistributedLockService distributedLockService)
    {
        _context = context;
        _backgroundJobClient = backgroundJobClient;
        _distributedLockService = distributedLockService;
    }

    public async Task<ReservationResultDto> CreateReservationAsync(CreateReservationRequest request, CancellationToken cancellationToken)
    {
        var lockKey = $"vehicle-lock-{request.VehicleId}";
        bool lockAcquired = await _distributedLockService.AcquireLockAsync(lockKey, TimeSpan.FromSeconds(10));

        if (!lockAcquired)
        {
            throw new ConflictException("Şu anda bu araç üzerinde başka bir işlem yapılıyor, lütfen tekrar deneyin.");
        }

        try
        {
            // 1. Araç mevcut mu?
            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == request.VehicleId, cancellationToken)
                ?? throw new NotFoundException("Belirtilen araç bulunamadı.");

        // 2. Çakışma Kontrolü (Zero Double-Booking)
        var hasConflict = await _context.Reservations
            .AnyAsync(r => r.VehicleId == request.VehicleId &&
                           r.Status != ReservationStatus.Cancelled &&
                           r.Status != ReservationStatus.Expired &&
                           r.Status != ReservationStatus.Completed &&
                           r.StartDate <= request.EndDate && r.EndDate >= request.StartDate, cancellationToken);

        if (hasConflict)
            throw new ConflictException("Bu araç belirtilen tarihler arasında başkası tarafından rezerve edilmiştir veya beklemededir.");

        // 3. Fiyat Hesaplama
        var days = (request.EndDate - request.StartDate).Days;
        if (days == 0) days = 1;

        decimal extrasTotal = 0;
        if (request.RentalExtraIds != null && request.RentalExtraIds.Any())
        {
            var extras = await _context.RentalExtras.Where(e => request.RentalExtraIds.Contains(e.Id)).ToListAsync(cancellationToken);
            foreach (var extra in extras)
            {
                extrasTotal += extra.PriceType == PriceType.PerDay ? extra.Price * days : extra.Price;
            }
        }

        decimal totalPrice = (vehicle.DailyPrice * days) + extrasTotal;

        // One-Way Fee (Lokasyonlar farklıysa ekstra 1000 TL transfer bedeli)
        if (request.PickupLocationId != request.DropoffLocationId)
            totalPrice += 1000m;

        // Phase 15: Credit Card Discount
        decimal discountAmount = 0;
        if (request.PaymentMethod == PaymentMethod.CreditCard)
        {
            discountAmount = totalPrice * 0.15m; // 15% discount
            totalPrice -= discountAmount;
        }

        // 4. Rezervasyonu Oluştur
        var reservation = new Reservation(request.UserId, request.VehicleId, request.PickupLocationId, request.DropoffLocationId, request.StartDate, request.EndDate, totalPrice, request.PaymentMethod, discountAmount, request.DriverFirstName, request.DriverLastName, request.DriverTcNo, request.DriverPhone);

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken); 

        if (request.RentalExtraIds != null)
        {
            foreach (var extraId in request.RentalExtraIds)
            {
                _context.ReservationExtras.Add(new ReservationExtra(reservation.Id, extraId));
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

            // 5. Hangfire ile 15 Dakika (900 sn) Kilidi Başlat
            _backgroundJobClient.Schedule<ReservationTimeoutJob>(
                job => job.CheckAndExpireReservationAsync(reservation.Id), 
                TimeSpan.FromMinutes(15));

            return new ReservationResultDto(reservation.Id, reservation.Status.ToString(), reservation.TotalPrice, "Rezervasyon başarıyla oluşturuldu. Ödeme için 15 dakikanız var.");
        }
        finally
        {
            await _distributedLockService.ReleaseLockAsync(lockKey);
        }
    }
}
