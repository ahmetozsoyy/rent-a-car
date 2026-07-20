using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class SupportMessageConfiguration : IEntityTypeConfiguration<SupportMessage>
{
    public void Configure(EntityTypeBuilder<SupportMessage> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.SenderName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.Content)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasOne(m => m.Location)
            .WithMany()
            .HasForeignKey(m => m.LocationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
