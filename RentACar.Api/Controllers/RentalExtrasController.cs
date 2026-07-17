using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RentalExtrasController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public RentalExtrasController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRentalExtras()
    {
        var extras = await _context.RentalExtras
            .Select(e => new { e.Id, e.Name, e.Price, e.PriceType })
            .ToListAsync();
            
        return Ok(extras);
    }
}
