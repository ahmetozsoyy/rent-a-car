namespace RentACar.Application.DTOs;

public record CreateReservationRequest(
    Guid UserId,
    Guid VehicleId,
    Guid PickupLocationId,
    Guid DropoffLocationId,
    DateTime StartDate,
    DateTime EndDate,
    List<Guid> RentalExtraIds
);
