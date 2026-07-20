using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.DTOs;
using RentACar.Application.Services;
using RentACar.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace RentACar.Api.Controllers;

public class ReservationsController : BaseController
{
    private readonly IReservationService _reservationService;
    private readonly IValidator<CreateReservationRequest> _validator;

    public ReservationsController(IReservationService reservationService, IValidator<CreateReservationRequest> validator)
    {
        _reservationService = reservationService;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request, CancellationToken cancellationToken)
    {
        // 1. FluentValidation ile Gelen İsteği Doğrula
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return BadRequest(new { error = "Validasyon hatası", details = errors });
        }

        // 2. İş Mantığını Çalıştır (Çakışma Kontrolü ve Hangfire Kilidi)
        var result = await _reservationService.CreateReservationAsync(request, cancellationToken);
        
        return Created("", result);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyReservations([FromServices] IApplicationDbContext context)
    {
        var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var reservations = await context.Reservations
            .Include(r => r.Vehicle)
            .Include(r => r.PickupLocation)
            .Include(r => r.DropoffLocation)
            .Where(r => r.UserId == userId)
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
}
