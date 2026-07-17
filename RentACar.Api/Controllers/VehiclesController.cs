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
    public async Task<IActionResult> GetAvailableVehicles(CancellationToken cancellationToken)
    {
        // JSON Döngü hatası (Circular Reference) almamak için Entity yerine anonim tip dönüyoruz
        var vehicles = await _context.Vehicles
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
            .ToListAsync(cancellationToken);
            
        return Ok(vehicles);
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
