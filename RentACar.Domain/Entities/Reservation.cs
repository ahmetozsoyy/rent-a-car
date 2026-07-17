using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities;

public class Reservation : BaseEntity
{
    public Guid UserId { get; private set; }
    public Guid VehicleId { get; private set; }
    public Guid PickupLocationId { get; private set; }
    public Guid DropoffLocationId { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public decimal TotalPrice { get; private set; }
    public ReservationStatus Status { get; private set; }
    
    // Phase 15: Payment & Discount
    public PaymentMethod PaymentMethod { get; private set; }
    public decimal DiscountAmount { get; private set; }

    // Phase 15: Driver Details (For "Başkası adına" scenario)
    public string? DriverFirstName { get; private set; }
    public string? DriverLastName { get; private set; }
    public string? DriverTcNo { get; private set; }
    public string? DriverPhone { get; private set; }

    public User User { get; private set; }
    public Vehicle Vehicle { get; private set; }
    public Location PickupLocation { get; private set; }
    public Location DropoffLocation { get; private set; }
    public ICollection<ReservationExtra> ReservationExtras { get; private set; } = new List<ReservationExtra>();

    protected Reservation() { } // EF Core

    public Reservation(Guid userId, Guid vehicleId, Guid pickupLocationId, Guid dropoffLocationId, 
        DateTime startDate, DateTime endDate, decimal totalPrice, 
        PaymentMethod paymentMethod = PaymentMethod.PayAtOffice, decimal discountAmount = 0,
        string? driverFirstName = null, string? driverLastName = null, string? driverTcNo = null, string? driverPhone = null)
    {
        UserId = userId;
        VehicleId = vehicleId;
        PickupLocationId = pickupLocationId;
        DropoffLocationId = dropoffLocationId;
        StartDate = startDate;
        EndDate = endDate;
        TotalPrice = totalPrice;
        PaymentMethod = paymentMethod;
        DiscountAmount = discountAmount;
        DriverFirstName = driverFirstName;
        DriverLastName = driverLastName;
        DriverTcNo = driverTcNo;
        DriverPhone = driverPhone;
        Status = ReservationStatus.Pending; // Initial status based on the 15-minute rule
    }

    public void UpdateStatus(ReservationStatus newStatus)
    {
        Status = newStatus;
    }
}
