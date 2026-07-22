using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Api.Controllers;

public class VehiclesController : BaseController
{
    private readonly IApplicationDbContext _context;

    public VehiclesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVehicles(CancellationToken cancellationToken)
    {
        var vehicles = await _context.Vehicles
            .Select(v => new 
            { 
                v.Id, v.Brand, v.Model, v.Year, v.DailyPrice, 
                v.Transmission, v.FuelType, v.BodyType, v.MinDriverAge, 
                v.ImageUrl, v.LicensePlate, Segment = v.Segment.ToString(),
                LocationName = v.CurrentLocation != null ? v.CurrentLocation.City + " Ofisi" : ""
            })
            .ToListAsync(cancellationToken);
            
        return Ok(vehicles);
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableVehicles([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] Guid pickupLocationId, CancellationToken cancellationToken)
    {
        startDate = startDate.ToUniversalTime();
        endDate = endDate.ToUniversalTime();

        var reservedVehicleIds = await _context.Reservations
            .Where(r => r.Status != RentACar.Domain.Enums.ReservationStatus.Cancelled && 
                        r.Status != RentACar.Domain.Enums.ReservationStatus.Completed && 
                        r.Status != RentACar.Domain.Enums.ReservationStatus.Expired)
            .Where(r => r.StartDate < endDate && r.EndDate > startDate)
            .Select(r => r.VehicleId)
            .ToListAsync(cancellationToken);

        var blockedVehicleIds = await _context.VehicleBlocks
            .Where(b => b.StartDate < endDate && b.EndDate > startDate)
            .Select(b => b.VehicleId)
            .ToListAsync(cancellationToken);

        var unavailableIds = reservedVehicleIds.Union(blockedVehicleIds).Distinct().ToList();

        var availableVehicles = await _context.Vehicles
            .Where(v => v.CurrentLocationId == pickupLocationId && !unavailableIds.Contains(v.Id))
            .Select(v => new 
            { 
                v.Id, v.Brand, v.Model, v.Year, v.DailyPrice, 
                v.Transmission, v.FuelType, v.BodyType, v.MinDriverAge, 
                v.ImageUrl, Segment = v.Segment.ToString() 
            })
            .ToListAsync(cancellationToken);

        return Ok(availableVehicles);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicleById(Guid id, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Where(v => v.Id == id)
            .Select(v => new 
            { 
                v.Id, 
                v.Brand, 
                v.Model, 
                v.Year,
                v.DailyPrice, 
                v.Transmission,
                v.FuelType,
                v.BodyType,
                v.MinDriverAge,
                v.ImageUrl,
                Segment = v.Segment.ToString() 
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (vehicle == null)
            return NotFound(new { message = "Araç bulunamadı." });

        return Ok(vehicle);
    }
}
