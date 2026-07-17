using RentACar.Domain.Enums;

namespace RentACar.Application.DTOs;

public record CreateReservationRequest(
    Guid UserId,
    Guid VehicleId,
    Guid PickupLocationId,
    Guid DropoffLocationId,
    DateTime StartDate,
    DateTime EndDate,
    List<Guid> RentalExtraIds,
    PaymentMethod PaymentMethod = PaymentMethod.PayAtOffice,
    string? DriverFirstName = null,
    string? DriverLastName = null,
    string? DriverTcNo = null,
    string? DriverPhone = null
);
