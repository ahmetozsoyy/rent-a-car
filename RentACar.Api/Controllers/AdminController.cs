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

[Authorize(Roles = "Admin")]
public class AdminController : BaseController
{
    private readonly IApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public AdminController(IApplicationDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpPost("assign-moderator")]
    public async Task<IActionResult> AssignModerator([FromBody] AssignRoleRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return NotFound("Kullanıcı bulunamadı.");

        var location = await _context.Locations.FindAsync(request.LocationId);
        if (location == null) return NotFound("Lokasyon bulunamadı.");

        user.UpdateRole(UserRole.Moderator, request.LocationId);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Moderatör yetkisi başarıyla atandı." });
    }

    [HttpPost("block-vehicle")]
    public async Task<IActionResult> BlockVehicle([FromBody] BlockVehicleRequest request)
    {
        var vehicle = await _context.Vehicles.FindAsync(request.VehicleId);
        if (vehicle == null) return NotFound("Araç bulunamadı.");

        var startDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc);
        var endDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc);

        var hasOverlap = await _context.VehicleBlocks
            .AnyAsync(b => b.VehicleId == request.VehicleId && 
                           b.StartDate < endDate && 
                           b.EndDate > startDate);

        if (hasOverlap)
            return BadRequest("Bu araç belirtilen tarihler arasında zaten yayından kaldırılmış durumda.");

        var block = new VehicleBlock(
            request.VehicleId, 
            DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc), 
            DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc), 
            request.Reason
        );
        _context.VehicleBlocks.Add(block);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Araç başarıyla yayından kaldırıldı." });
    }

    [HttpGet("blocked-vehicles")]
    public async Task<IActionResult> GetBlockedVehicles()
    {
        var blocks = await _context.VehicleBlocks
            .Include(b => b.Vehicle)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new {
                b.Id,
                b.VehicleId,
                Vehicle = b.Vehicle.Brand + " " + b.Vehicle.Model + (string.IsNullOrEmpty(b.Vehicle.LicensePlate) ? "" : " - " + b.Vehicle.LicensePlate),
                StartDate = b.StartDate.ToString("dd MMM yyyy"),
                EndDate = b.EndDate.ToString("dd MMM yyyy"),
                b.Reason
            })
            .ToListAsync();

        return Ok(blocks);
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

    [HttpGet("locations-with-messages")]
    public async Task<IActionResult> GetLocationsWithMessages()
    {
        var locations = await _context.Locations
            .OrderBy(l => l.Name)
            .Select(l => new {
                l.Id,
                l.Name,
                l.City
            })
            .ToListAsync();

        return Ok(locations);
    }

    [HttpGet("messages/{locationId}")]
    public async Task<IActionResult> GetMessages(Guid locationId)
    {
        var messages = await _context.SupportMessages
            .Where(m => m.LocationId == locationId)
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
    public async Task<IActionResult> SendMessage([FromBody] AdminSendMessageRequest request)
    {
        var location = await _context.Locations.FindAsync(request.LocationId);
        if (location == null) return NotFound("Şube bulunamadı.");

        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest("Mesaj içeriği boş olamaz.");

        var message = new SupportMessage(
            request.LocationId,
            "Admin",
            request.Content,
            true // Admin'den gidiyor
        );

        _context.SupportMessages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);

        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new {
            Type = "NEW_MESSAGE",
            LocationId = request.LocationId,
            TargetRole = "Moderator",
            Message = "Admin'den yeni bir mesajınız var!"
        });

        return Ok(new { Message = "Mesaj gönderildi." });
    }
}
