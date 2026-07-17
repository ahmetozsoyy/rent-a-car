using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasKey(v => v.Id);
        
        builder.Property(v => v.Brand).IsRequired().HasMaxLength(50);
        builder.Property(v => v.Model).IsRequired().HasMaxLength(50);
        builder.Property(v => v.DailyPrice).HasColumnType("decimal(18,2)");
        
        builder.Property(v => v.RowVersion).IsConcurrencyToken();
               
        builder.HasOne(v => v.CurrentLocation)
               .WithMany(l => l.Vehicles)
               .HasForeignKey(v => v.CurrentLocationId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
