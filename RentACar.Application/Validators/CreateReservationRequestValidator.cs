using FluentValidation;
using RentACar.Application.DTOs;

namespace RentACar.Application.Validators;

public class CreateReservationRequestValidator : AbstractValidator<CreateReservationRequest>
{
    public CreateReservationRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().WithMessage("Kullanıcı ID gereklidir.");
        RuleFor(x => x.VehicleId).NotEmpty().WithMessage("Araç ID gereklidir.");
        RuleFor(x => x.PickupLocationId).NotEmpty().WithMessage("Alış lokasyonu gereklidir.");
        RuleFor(x => x.DropoffLocationId).NotEmpty().WithMessage("Teslim lokasyonu gereklidir.");
        
        RuleFor(x => x.StartDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date).WithMessage("Başlangıç tarihi geçmişte olamaz.");
            
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");

        // Driver validations (optional but constrained if provided)
        RuleFor(x => x.DriverFirstName).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.DriverFirstName));
        RuleFor(x => x.DriverLastName).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.DriverLastName));
        RuleFor(x => x.DriverTcNo).Length(11).When(x => !string.IsNullOrEmpty(x.DriverTcNo)).WithMessage("T.C. Kimlik numarası 11 haneli olmalıdır.");
        RuleFor(x => x.DriverPhone).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.DriverPhone));
    }
}
