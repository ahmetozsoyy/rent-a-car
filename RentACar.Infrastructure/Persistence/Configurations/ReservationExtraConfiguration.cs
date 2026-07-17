using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Persistence.Configurations;

public class ReservationExtraConfiguration : IEntityTypeConfiguration<ReservationExtra>
{
    public void Configure(EntityTypeBuilder<ReservationExtra> builder)
    {
        // Composite Primary Key (Çoka çok ilişki ara tablosu)
        builder.HasKey(re => new { re.ReservationId, re.RentalExtraId });

        builder.HasOne(re => re.Reservation)
               .WithMany(r => r.ReservationExtras)
               .HasForeignKey(re => re.ReservationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(re => re.RentalExtra)
               .WithMany()
               .HasForeignKey(re => re.RentalExtraId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
