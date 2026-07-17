using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.HasKey(l => l.Id);
        
        builder.Property(l => l.Name).IsRequired().HasMaxLength(100);
        builder.Property(l => l.Address).IsRequired().HasMaxLength(500);
        builder.Property(l => l.City).IsRequired().HasMaxLength(50);
    }
}
