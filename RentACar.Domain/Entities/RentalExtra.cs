using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities;

public class RentalExtra : BaseEntity
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }
    public PriceType PriceType { get; private set; }

    protected RentalExtra() { } // EF Core

    public RentalExtra(string name, decimal price, PriceType priceType)
    {
        Name = name;
        Price = price;
        PriceType = priceType;
    }
}
