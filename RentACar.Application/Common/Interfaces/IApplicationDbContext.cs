using Microsoft.EntityFrameworkCore;
using RentACar.Domain.Entities;

namespace RentACar.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Location> Locations { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<RentalExtra> RentalExtras { get; }
    DbSet<Reservation> Reservations { get; }
    DbSet<ReservationExtra> ReservationExtras { get; }
    DbSet<VehicleBlock> VehicleBlocks { get; }
    DbSet<SupportMessage> SupportMessages { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
