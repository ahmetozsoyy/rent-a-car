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

        var plates = new string[] {
            "34 HGY 412", "34 BCD 988", "34 KLN 305", "34 PAS 721", "34 RAZ 554", "34 CHL 678",
            "06 GGF 219", "06 DRC 663", "06 CHN 801", "06 MKP 475", "06 DSR 132", "06 FGH 901",
            "35 AJL 934", "35 EFR 256", "35 CMB 710", "35 CTC 589", "35 DTY 402", "35 DUP 342",
            "16 LKM 159", "16 PDS 753", "16 BNH 426", "16 FDS 814", "16 DGT 369", "16 DXC 567",
            "48 CAA 951", "48 ACC 357", "48 ASA 248", "48 AEA 654", "48 ARE 123", "48 AAE 890"
        };
        int plateIndex = 0;

        var allLocations = await context.Locations.OrderBy(l => l.Id).ToListAsync();
        foreach (var loc in allLocations)
        {
            var existingVehicles = await context.Vehicles.Where(v => v.CurrentLocationId == loc.Id).OrderBy(v => v.Id).ToListAsync();
            
            if (existingVehicles.Count == 0)
            {
                context.Vehicles.Add(new Vehicle("Fiat", "Egea", 2023, VehicleSegment.Economy, 2200, "Manuel", "Dizel", "Sedan", 21, "/images/vehicles/fiat-egea.png", plates[plateIndex++], loc.Id));
                context.Vehicles.Add(new Vehicle("Volkswagen", "Polo", 2024, VehicleSegment.Economy, 2450, "Otomatik", "Benzin", "Hatchback", 21, "/images/vehicles/vw-polo.jpg", plates[plateIndex++], loc.Id));
                context.Vehicles.Add(new Vehicle("Toyota", "Corolla", 2024, VehicleSegment.Standard, 3000, "Otomatik", "Hibrit", "Sedan", 25, "/images/vehicles/toyota-corolla.jpg", plates[plateIndex++], loc.Id));
                context.Vehicles.Add(new Vehicle("BMW", "5.20 (G30)", 2023, VehicleSegment.Premium, 7500, "Otomatik", "Benzin", "Sedan", 27, "/images/vehicles/bmw-5.jpg", plates[plateIndex++], loc.Id));
                context.Vehicles.Add(new Vehicle("Peugeot", "Rifter", 2023, VehicleSegment.Standard, 2850, "Otomatik", "Dizel", "Van", 25, "/images/vehicles/peugeot-rifter.jpg", plates[plateIndex++], loc.Id));
                context.Vehicles.Add(new Vehicle("Volkswagen", "T-Roc", 2024, VehicleSegment.SUV, 3500, "Otomatik", "Benzin", "SUV", 25, "/images/vehicles/vw-troc.jpg", plates[plateIndex++], loc.Id));
            }
            else
            {
                // Mevcut araçların plakalarını güncelle (migration sonrası null ise)
                foreach (var ev in existingVehicles)
                {
                    if (string.IsNullOrEmpty(ev.LicensePlate) && plateIndex < plates.Length)
                    {
                        var prop = ev.GetType().GetProperty("LicensePlate");
                        if (prop != null && prop.CanWrite)
                        {
                            prop.SetValue(ev, plates[plateIndex]);
                        }
                        else
                        {
                            // Backing field update for EF Core if private setter
                            context.Entry(ev).Property(e => e.LicensePlate).CurrentValue = plates[plateIndex];
                        }
                    }
                    plateIndex++;
                }
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
