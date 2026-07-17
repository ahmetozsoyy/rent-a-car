namespace RentACar.Application.DTOs;

public record ReservationResultDto(
    Guid ReservationId,
    string Status,
    decimal TotalPrice,
    string Message
);
