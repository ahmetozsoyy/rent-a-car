using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public LocationsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLocations()
    {
        var locations = await _context.Locations
            .Select(l => new { l.Id, l.Name, l.City, l.Capacity })
            .ToListAsync();
            
        return Ok(locations);
    }
}
