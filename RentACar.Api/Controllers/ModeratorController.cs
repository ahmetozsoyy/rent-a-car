using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.DTOs;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using System.Security.Claims;

namespace RentACar.Api.Controllers;

[Authorize(Roles = "Moderator,Admin")]
public class ModeratorController : BaseController
{
    private readonly IApplicationDbContext _context;

    public ModeratorController(IApplicationDbContext context)
    {
        _context = context;
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

        var block = new VehicleBlock(request.VehicleId, request.StartDate, request.EndDate, request.Reason);
        _context.VehicleBlocks.Add(block);
        await _context.SaveChangesAsync(CancellationToken.None);

        return Ok(new { Message = "Araç başarıyla yayından kaldırıldı." });
    }
}
