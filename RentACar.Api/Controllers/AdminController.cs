using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.DTOs;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using System.Security.Claims;

namespace RentACar.Api.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : BaseController
{
    private readonly IApplicationDbContext _context;

    public AdminController(IApplicationDbContext context)
    {
        _context = context;
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

        var block = new VehicleBlock(request.VehicleId, request.StartDate, request.EndDate, request.Reason);
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
                Vehicle = b.Vehicle.Brand + " " + b.Vehicle.Model,
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
}
