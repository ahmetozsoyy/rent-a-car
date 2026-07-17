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
            var loc3 = new Location("İzmir Adnan Menderes", "Gaziemir", "İzmir", 40);
            var loc4 = new Location("Bursa Şehir Merkezi", "Osmangazi", "Bursa", 30);
            
            context.Locations.AddRange(loc1, loc2, loc3, loc4);
            await context.SaveChangesAsync();
        }

        // 3. Araçlar
        if (await context.Vehicles.AnyAsync(v => v.Brand == "Mercedes-Benz" || v.Brand == "Tesla"))
        {
            var oldVehicles = await context.Vehicles.ToListAsync();
            var vehicleIds = oldVehicles.Select(v => v.Id).ToList();
            var oldReservations = await context.Reservations.Where(r => vehicleIds.Contains(r.VehicleId)).ToListAsync();
            
            context.Reservations.RemoveRange(oldReservations);
            context.Vehicles.RemoveRange(oldVehicles);
            await context.SaveChangesAsync();
        }

        if (!await context.Vehicles.AnyAsync())
        {
            var ist = await context.Locations.FirstAsync(l => l.City == "İstanbul");
            var ank = await context.Locations.FirstAsync(l => l.City == "Ankara");
            
            var v1 = new Vehicle("Fiat", "Egea", 2023, VehicleSegment.Economy, 2200, "Manuel", "Dizel", "Sedan", 21, "/images/vehicles/fiat-egea.png", ist.Id);
            var v2 = new Vehicle("Volkswagen", "Polo", 2024, VehicleSegment.Economy, 2450, "Otomatik", "Benzin", "Hatchback", 21, "/images/vehicles/vw-polo.jpg", ist.Id);
            var v3 = new Vehicle("Toyota", "Corolla", 2024, VehicleSegment.Standard, 3000, "Otomatik", "Hibrit", "Sedan", 25, "/images/vehicles/toyota-corolla.jpg", ank.Id);
            var v4 = new Vehicle("BMW", "5.20 (G30)", 2023, VehicleSegment.Premium, 7500, "Otomatik", "Benzin", "Sedan", 27, "/images/vehicles/bmw-5.jpg", ist.Id);
            var v5 = new Vehicle("Peugeot", "Rifter", 2023, VehicleSegment.Standard, 2850, "Otomatik", "Dizel", "Van", 25, "/images/vehicles/peugeot-rifter.jpg", ank.Id);
            var v6 = new Vehicle("Volkswagen", "T-Roc", 2024, VehicleSegment.SUV, 3500, "Otomatik", "Benzin", "SUV", 25, "/images/vehicles/vw-troc.jpg", ist.Id);

            context.Vehicles.AddRange(v1, v2, v3, v4, v5, v6);
            await context.SaveChangesAsync();
        }
        
        // 4. Ekstralar (Rental Extras)
        if (!await context.RentalExtras.AnyAsync())
        {
            context.RentalExtras.AddRange(
                new RentalExtra("Bebek Koltuğu", 250, PriceType.PerDay),
                new RentalExtra("Tam Kapsamlı Premium Sigorta", 1500, PriceType.PerDay),
                new RentalExtra("Ek Sürücü", 500, PriceType.Fixed),
                new RentalExtra("Ek Cam ve Lastik Güvencesi", 350, PriceType.PerDay)
            );
            await context.SaveChangesAsync();
        }
    }
}
