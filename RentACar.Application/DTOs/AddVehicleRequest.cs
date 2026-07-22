using RentACar.Domain.Enums;

namespace RentACar.Application.DTOs;

public class AddVehicleRequest
{
    public string Brand { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public VehicleSegment Segment { get; set; }
    public decimal DailyPrice { get; set; }
    public string Transmission { get; set; }
    public string FuelType { get; set; }
    public string BodyType { get; set; }
    public int MinDriverAge { get; set; }
    public string ImageUrl { get; set; }
    public string LicensePlate { get; set; }
    public Guid LocationId { get; set; }
}
