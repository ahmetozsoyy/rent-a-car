using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.DTOs;
using RentACar.Application.Services;

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
}
