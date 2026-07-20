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
}
