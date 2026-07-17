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
    public Guid CurrentLocationId { get; private set; }
    
    // Optimistic Concurrency Token
    public byte[] RowVersion { get; private set; }

    public Location CurrentLocation { get; private set; }
    public ICollection<Reservation> Reservations { get; private set; } = new List<Reservation>();

    protected Vehicle() { } // EF Core

    public Vehicle(string brand, string model, int year, VehicleSegment segment, decimal dailyPrice, Guid currentLocationId)
    {
        Brand = brand;
        Model = model;
        Year = year;
        Segment = segment;
        DailyPrice = dailyPrice;
        CurrentLocationId = currentLocationId;
    }

    public void UpdateLocation(Guid newLocationId)
    {
        CurrentLocationId = newLocationId;
    }
}
