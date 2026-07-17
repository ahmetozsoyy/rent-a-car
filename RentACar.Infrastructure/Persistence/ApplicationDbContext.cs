using System.Reflection;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<RentalExtra> RentalExtras { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<ReservationExtra> ReservationExtras { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API konfigürasyonlarını otomatik olarak bu assembly'den yükler.
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}
