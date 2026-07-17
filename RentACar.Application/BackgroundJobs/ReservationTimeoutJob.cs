using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Enums;

namespace RentACar.Application.BackgroundJobs;

public class ReservationTimeoutJob
{
    private readonly IApplicationDbContext _context;

    public ReservationTimeoutJob(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CheckAndExpireReservationAsync(Guid reservationId)
    {
        var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId);
        if (reservation == null) return;

        // Sadece ödeme yapılmamışsa iptal et
        if (reservation.Status == ReservationStatus.Pending)
        {
            reservation.UpdateStatus(ReservationStatus.Expired);
            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }
}
