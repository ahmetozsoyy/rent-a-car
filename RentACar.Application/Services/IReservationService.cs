using RentACar.Application.DTOs;

namespace RentACar.Application.Services;

public interface IReservationService
{
    Task<ReservationResultDto> CreateReservationAsync(CreateReservationRequest request, CancellationToken cancellationToken);
}
