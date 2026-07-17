using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class RentalExtraConfiguration : IEntityTypeConfiguration<RentalExtra>
{
    public void Configure(EntityTypeBuilder<RentalExtra> builder)
    {
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Price).HasColumnType("decimal(18,2)");
    }
}
