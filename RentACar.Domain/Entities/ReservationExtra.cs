namespace RentACar.Domain.Entities;

public class ReservationExtra
{
    public Guid ReservationId { get; private set; }
    public Guid RentalExtraId { get; private set; }

    public Reservation Reservation { get; private set; }
    public RentalExtra RentalExtra { get; private set; }

    protected ReservationExtra() { }

    public ReservationExtra(Guid reservationId, Guid rentalExtraId)
    {
        ReservationId = reservationId;
        RentalExtraId = rentalExtraId;
    }
}
