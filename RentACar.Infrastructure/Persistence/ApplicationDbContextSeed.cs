using Microsoft.EntityFrameworkCore;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;

namespace RentACar.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Kullanıcılar
        if (!await context.Users.AnyAsync())
        {
            var user = new User("Test", "Müşterisi", "test@mercedes.com", "dummy_hash_123", UserRole.Customer);
            context.Users.Add(user);
            await context.SaveChangesAsync();
        }

        // 2. Lokasyonlar
        if (!await context.Locations.AnyAsync())
        {
            var loc1 = new Location("İstanbul Havalimanı", "Arnavutköy", "İstanbul", 100);
            var loc2 = new Location("Ankara Esenboğa", "Çubuk", "Ankara", 50);
            
            context.Locations.AddRange(loc1, loc2);
            await context.SaveChangesAsync();
        }

        // 3. Araçlar
        if (!await context.Vehicles.AnyAsync())
        {
            var ist = await context.Locations.FirstAsync(l => l.City == "İstanbul");
            var ank = await context.Locations.FirstAsync(l => l.City == "Ankara");
            
            var v1 = new Vehicle("Mercedes-Benz", "G63 AMG", 2024, VehicleSegment.Luxury, 15000, ist.Id);
            var v2 = new Vehicle("Tesla", "Model S Plaid", 2024, VehicleSegment.Luxury, 12000, ist.Id);
            var v3 = new Vehicle("BMW", "i8", 2023, VehicleSegment.Luxury, 14000, ank.Id);

            context.Vehicles.AddRange(v1, v2, v3);
            await context.SaveChangesAsync();
        }
        
        // 4. Ekstralar (Rental Extras)
        if (!await context.RentalExtras.AnyAsync())
        {
            context.RentalExtras.AddRange(
                new RentalExtra("Bebek Koltuğu", 250, PriceType.PerDay),
                new RentalExtra("Tam Kapsamlı Premium Sigorta", 1500, PriceType.PerDay),
                new RentalExtra("Ek Sürücü", 500, PriceType.Fixed)
            );
            await context.SaveChangesAsync();
        }
    }
}
