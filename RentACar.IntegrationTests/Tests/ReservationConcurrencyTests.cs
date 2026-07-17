using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using RentACar.Application.DTOs;
using RentACar.Infrastructure.Persistence;
using RentACar.IntegrationTests.Common;
using Xunit;
using Microsoft.EntityFrameworkCore;

namespace RentACar.IntegrationTests.Tests;

public class ReservationConcurrencyTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public ReservationConcurrencyTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreateReservation_WhenCalledConcurrently_ShouldOnlyAllowOneAndRejectOthers()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        // Ensure db is ready and get seeded items
        var user = await context.Users.FirstAsync();
        var vehicle = await context.Vehicles.FirstAsync();
        var location = await context.Locations.FirstAsync();

        var client = _factory.CreateClient();

        var requestDto = new CreateReservationRequest(
            user.Id,
            vehicle.Id,
            location.Id,
            location.Id,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(3),
            new List<Guid>()
        );

        int concurrentRequests = 5;
        var tasks = new List<Task<HttpResponseMessage>>();

        // Act
        for (int i = 0; i < concurrentRequests; i++)
        {
            tasks.Add(client.PostAsJsonAsync("/api/reservations", requestDto));
        }

        var responses = await Task.WhenAll(tasks);

        // Assert
        var successResponses = responses.Count(r => r.IsSuccessStatusCode);
        var conflictResponses = responses.Count(r => r.StatusCode == HttpStatusCode.Conflict);

        successResponses.Should().Be(1, "Sadece 1 rezervasyon başarılı olmalıdır.");
        conflictResponses.Should().Be(concurrentRequests - 1, "Diğer tüm eşzamanlı istekler Conflict (409) hatası almalıdır.");
    }
}
