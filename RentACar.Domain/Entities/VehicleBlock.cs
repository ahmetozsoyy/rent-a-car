using RentACar.Domain.Common;
using System;

namespace RentACar.Domain.Entities;

public class VehicleBlock : BaseEntity
{
    public Guid VehicleId { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string Reason { get; private set; }

    public Vehicle Vehicle { get; private set; }

    protected VehicleBlock() { } // EF Core

    public VehicleBlock(Guid vehicleId, DateTime startDate, DateTime endDate, string reason)
    {
        if (startDate >= endDate) throw new ArgumentException("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
        
        VehicleId = vehicleId;
        StartDate = startDate;
        EndDate = endDate;
        Reason = reason;
    }
}
