namespace RentACar.Application.DTOs;
using System;

public class BlockVehicleRequest
{
    public Guid VehicleId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; }
}
