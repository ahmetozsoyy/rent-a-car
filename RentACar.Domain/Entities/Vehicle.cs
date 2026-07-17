using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities;

public class Vehicle : BaseEntity
{
    public string Brand { get; private set; }
    public string Model { get; private set; }
    public int Year { get; private set; }
    public VehicleSegment Segment { get; private set; }
    public decimal DailyPrice { get; private set; }
    public string Transmission { get; private set; }
    public string FuelType { get; private set; }
    public string BodyType { get; private set; }
    public int MinDriverAge { get; private set; }
    public string ImageUrl { get; private set; }
    public Guid CurrentLocationId { get; private set; }
    public byte[] RowVersion { get; private set; }
    

    public Location CurrentLocation { get; private set; }
    public ICollection<Reservation> Reservations { get; private set; } = new List<Reservation>();

    protected Vehicle() { } // EF Core

    public Vehicle(string brand, string model, int year, VehicleSegment segment, decimal dailyPrice, string transmission, string fuelType, string bodyType, int minDriverAge, string imageUrl, Guid currentLocationId)
    {
        Brand = brand;
        Model = model;
        Year = year;
        Segment = segment;
        DailyPrice = dailyPrice;
        Transmission = transmission;
        FuelType = fuelType;
        BodyType = bodyType;
        MinDriverAge = minDriverAge;
        ImageUrl = imageUrl;
        CurrentLocationId = currentLocationId;
        RowVersion = Guid.NewGuid().ToByteArray();
    }

    public void UpdateLocation(Guid newLocationId)
    {
        CurrentLocationId = newLocationId;
    }
}
