using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using RentACar.Application.Services;
using System.Reflection;

namespace RentACar.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddScoped<IReservationService, ReservationService>();
        
        return services;
    }
}
