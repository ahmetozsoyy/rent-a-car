namespace RentACar.Application.DTOs;

public record AuthResponse(
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string Token
);
