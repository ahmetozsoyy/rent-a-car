using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.DTOs;
using RentACar.Domain.Entities;
using RentACar.Domain.Exceptions;

namespace RentACar.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IApplicationDbContext dbContext,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email))
        {
            throw new Exception("Bu e-posta adresi zaten kullanımda.");
        }

        var user = new User
        (
            request.FirstName,
            request.LastName,
            request.Email,
            _passwordHasher.HashPassword(request.Password)
        );

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(CancellationToken.None);

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse(user.Id, user.FirstName, user.LastName, user.Email, token);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == request.Email);

        if (user is null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new Exception("Geçersiz e-posta veya şifre.");
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse(user.Id, user.FirstName, user.LastName, user.Email, token);
    }
}
