using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.TotalPrice).HasColumnType("decimal(18,2)");

        // Foreign Key İlişkileri (Silinme korumalı)
        builder.HasOne(r => r.User)
               .WithMany(u => u.Reservations)
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Vehicle)
               .WithMany(v => v.Reservations)
               .HasForeignKey(r => r.VehicleId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.PickupLocation)
               .WithMany()
               .HasForeignKey(r => r.PickupLocationId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.DropoffLocation)
               .WithMany()
               .HasForeignKey(r => r.DropoffLocationId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
