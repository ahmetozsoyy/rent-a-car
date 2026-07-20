using Microsoft.EntityFrameworkCore;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;

namespace RentACar.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Kullanıcılar
        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "ozsoyyahmett@gmail.com");
        if (adminUser == null)
        {
            adminUser = new User("Ahmet", "Özsoy", "ozsoyyahmett@gmail.com", "admin_hash_123", UserRole.Admin);
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }
        else if (adminUser.Role != UserRole.Admin)
        {
            adminUser.UpdateRole(UserRole.Admin);
            await context.SaveChangesAsync();
        }

        // 2. Lokasyonlar
        var izmir = await context.Locations.FirstOrDefaultAsync(l => l.City == "İzmir");
        if (izmir == null)
        {
            var loc3 = new Location("İzmir Adnan Menderes", "Gaziemir", "İzmir", 40);
            var loc4 = new Location("Bursa Şehir Merkezi", "Osmangazi", "Bursa", 30);
            var loc5 = new Location("Muğla Bodrum-Milas", "Milas", "Muğla", 25);
            context.Locations.AddRange(loc3, loc4, loc5);
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

        var allLocations = await context.Locations.ToListAsync();
        foreach (var loc in allLocations)
        {
            var existingCount = await context.Vehicles.CountAsync(v => v.CurrentLocationId == loc.Id);
            if (existingCount < 6)
            {
                if (!await context.Vehicles.AnyAsync(v => v.Brand == "Fiat" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("Fiat", "Egea", 2023, VehicleSegment.Economy, 2200, "Manuel", "Dizel", "Sedan", 21, "/images/vehicles/fiat-egea.png", loc.Id));
                
                if (!await context.Vehicles.AnyAsync(v => v.Brand == "Volkswagen" && v.Model == "Polo" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("Volkswagen", "Polo", 2024, VehicleSegment.Economy, 2450, "Otomatik", "Benzin", "Hatchback", 21, "/images/vehicles/vw-polo.jpg", loc.Id));
                    
                if (!await context.Vehicles.AnyAsync(v => v.Brand == "Toyota" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("Toyota", "Corolla", 2024, VehicleSegment.Standard, 3000, "Otomatik", "Hibrit", "Sedan", 25, "/images/vehicles/toyota-corolla.jpg", loc.Id));

                if (!await context.Vehicles.AnyAsync(v => v.Brand == "BMW" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("BMW", "5.20 (G30)", 2023, VehicleSegment.Premium, 7500, "Otomatik", "Benzin", "Sedan", 27, "/images/vehicles/bmw-5.jpg", loc.Id));

                if (!await context.Vehicles.AnyAsync(v => v.Brand == "Peugeot" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("Peugeot", "Rifter", 2023, VehicleSegment.Standard, 2850, "Otomatik", "Dizel", "Van", 25, "/images/vehicles/peugeot-rifter.jpg", loc.Id));

                if (!await context.Vehicles.AnyAsync(v => v.Brand == "Volkswagen" && v.Model == "T-Roc" && v.CurrentLocationId == loc.Id))
                    context.Vehicles.Add(new Vehicle("Volkswagen", "T-Roc", 2024, VehicleSegment.SUV, 3500, "Otomatik", "Benzin", "SUV", 25, "/images/vehicles/vw-troc.jpg", loc.Id));
            }
        }
        await context.SaveChangesAsync();
        
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
