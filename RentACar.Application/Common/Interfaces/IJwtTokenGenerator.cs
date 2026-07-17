using RentACar.Domain.Entities;

namespace RentACar.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
