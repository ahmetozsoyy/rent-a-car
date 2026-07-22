using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.DTOs;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using RentACar.Api.Hubs;

namespace RentACar.Api.Controllers;

[Authorize(Roles = "Moderator,Admin")]
public class ModeratorController : BaseController
{
    private readonly IApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public ModeratorController(IApplicationDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet("reservations")]
    public async Task<IActionResult> GetBranchReservations()
    {
        // Token'dan NameIdentifier (Guid id) al
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.ManagedLocationId.HasValue) return Forbid("Atanmış bir şubeniz bulunmuyor.");

        var reservations = await _context.Reservations
            .Include(r => r.Vehicle)
            .Include(r => r.PickupLocation)
            .Include(r => r.DropoffLocation)
            .Where(r => r.PickupLocationId == user.ManagedLocationId || r.DropoffLocationId == user.ManagedLocationId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new {
                r.Id,
                PnrCode = r.Id.ToString().Substring(0, 8).ToUpper(),
                Vehicle = r.Vehicle.Brand + " " + r.Vehicle.Model,
                Image = r.Vehicle.ImageUrl,
                PickupDate = r.StartDate.ToString("dd MMM yyyy HH:mm"),
                DropoffDate = r.EndDate.ToString("dd MMM yyyy HH:mm"),
                PickupLocation = r.PickupLocation.Name,
                DropoffLocation = r.DropoffLocation.Name,
                Status = r.Status.ToString(),
                Price = r.TotalPrice
            })
            .ToListAsync();

        return Ok(reservations);
    }

    [HttpPost("block-vehicle")]
    public async Task<IActionResult> BlockVehicle([FromBody] BlockVehicleRequest request)
    {
        // Admin ve Moderatörler araçları kapatabilir.
        var vehicle = await _context.Vehicles.FindAsync(request.VehicleId);
        if (vehicle == null) return NotFound("Araç bulunamadı.");

        var startDate = request.StartDate.ToUniversalTime();
        var endDate = request.EndDate.ToUniversalTime();

        var hasOverlap = await _context.VehicleBlocks
            .AnyAsync(b => b.VehicleId == request.VehicleId && 
                           b.StartDate < endDate && 
                           b.EndDate > startDate);

        if (hasOverlap)
            return BadRequest("Bu araç belirtilen tarihler arasında zaten yayından kaldırılmış durumda.");

        var block = new VehicleBlock(
            request.VehicleId, 
            request.StartDate.ToUniversalTime(), 
            request.EndDate.ToUniversalTime(), 
            request.Reason
        );
        _context.VehicleBlocks.Add(block);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Araç başarıyla yayından kaldırıldı." });
    }

    [HttpGet("blocked-vehicles")]
    public async Task<IActionResult> GetBlockedVehicles()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.ManagedLocationId.HasValue) return Forbid("Atanmış bir şubeniz bulunmuyor.");

        var blocks = await _context.VehicleBlocks
            .Include(b => b.Vehicle)
            .Where(b => b.Vehicle.CurrentLocationId == user.ManagedLocationId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new {
                b.Id,
                b.VehicleId,
                Vehicle = b.Vehicle.Brand + " " + b.Vehicle.Model,
                StartDate = b.StartDate.ToString("dd MMM yyyy"),
                EndDate = b.EndDate.ToString("dd MMM yyyy"),
                b.Reason
            })
            .ToListAsync();

        return Ok(blocks);
    }

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetBranchVehicles()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.ManagedLocationId.HasValue) return Forbid("Atanmış bir şubeniz bulunmuyor.");

        var vehicles = await _context.Vehicles
            .Include(v => v.CurrentLocation)
            .Where(v => v.CurrentLocationId == user.ManagedLocationId)
            .Select(v => new 
            { 
                v.Id, v.Brand, v.Model, v.Year, v.DailyPrice, 
                v.Transmission, v.FuelType, v.BodyType, v.MinDriverAge, 
                v.ImageUrl, Segment = v.Segment.ToString(),
                LocationName = v.CurrentLocation != null ? v.CurrentLocation.City + " Ofisi" : ""
            })
            .ToListAsync();

        return Ok(vehicles);
    }

    [HttpDelete("unblock-vehicle/{id}")]
    public async Task<IActionResult> UnblockVehicle(Guid id)
    {
        var block = await _context.VehicleBlocks.FindAsync(id);
        if (block == null) return NotFound("Kayıt bulunamadı.");

        _context.VehicleBlocks.Remove(block);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Araç blokesi kaldırıldı." });
    }

    [HttpPost("approve-reservation/{id}")]
    public async Task<IActionResult> ApproveReservation(Guid id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound("Rezervasyon bulunamadı.");

        // Onaylandığında Aktif yapalım (veya Confirmed)
        reservation.UpdateStatus(ReservationStatus.Active);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Rezervasyon onaylandı." });
    }

    [HttpPost("reject-reservation/{id}")]
    public async Task<IActionResult> RejectReservation(Guid id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound("Rezervasyon bulunamadı.");

        reservation.UpdateStatus(ReservationStatus.Cancelled);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Rezervasyon reddedildi." });
    }

    [HttpDelete("delete-reservation/{id}")]
    public async Task<IActionResult> DeleteReservation(Guid id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound("Rezervasyon bulunamadı.");

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Rezervasyon başarıyla silindi." });
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.ManagedLocationId.HasValue) return Forbid("Atanmış bir şubeniz bulunmuyor.");

        var messages = await _context.SupportMessages
            .Where(m => m.LocationId == user.ManagedLocationId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new SupportMessageDto(
                m.Id,
                m.LocationId,
                m.Location.Name,
                m.SenderName,
                m.Content,
                m.IsFromAdmin,
                m.CreatedAt))
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("messages")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.ManagedLocationId.HasValue) return Forbid("Atanmış bir şubeniz bulunmuyor.");

        if (string.IsNullOrWhiteSpace(request.SenderName) || string.IsNullOrWhiteSpace(request.Content))
            return BadRequest("Ad ve mesaj içeriği boş olamaz.");

        var message = new SupportMessage(
            user.ManagedLocationId.Value,
            request.SenderName,
            request.Content,
            false // Admin'den gelmiyor, şubeden gidiyor.
        );

        _context.SupportMessages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);

        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new {
            Type = "NEW_MESSAGE",
            LocationId = user.ManagedLocationId.Value,
            TargetRole = "Admin",
            Message = $"{request.SenderName} adlı şube çalışanından yeni bir mesajınız var!"
        });

        return Ok(new { Message = "Mesaj gönderildi." });
    }
}
