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
                v.DailyPrice, 
                Segment = v.Segment.ToString() 
            })
            .ToListAsync(cancellationToken);
            
        return Ok(vehicles);
    }
}
