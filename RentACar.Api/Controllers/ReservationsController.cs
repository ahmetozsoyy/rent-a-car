using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.DTOs;
using RentACar.Application.Services;
using RentACar.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using RentACar.Api.Hubs;

namespace RentACar.Api.Controllers;

public class ReservationsController : BaseController
{
    private readonly IReservationService _reservationService;
    private readonly IValidator<CreateReservationRequest> _validator;
    private readonly IHubContext<NotificationHub> _hubContext;

    public ReservationsController(
        IReservationService reservationService, 
        IValidator<CreateReservationRequest> validator,
        IHubContext<NotificationHub> hubContext)
    {
        _reservationService = reservationService;
        _validator = validator;
        _hubContext = hubContext;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request, CancellationToken cancellationToken)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();
        
        request = request with { UserId = userId };

        // 1. FluentValidation ile Gelen İsteği Doğrula
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return BadRequest(new { error = "Validasyon hatası", details = errors });
        }

        // 2. İş Mantığını Çalıştır (Çakışma Kontrolü ve Hangfire Kilidi)
        var result = await _reservationService.CreateReservationAsync(request, cancellationToken);
        
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new {
            Type = "NEW_RESERVATION",
            LocationId = request.PickupLocationId,
            ReservationId = result.ReservationId,
            Message = "Şubenize yeni bir araç kiralama rezervasyonu geldi!"
        });
        
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
