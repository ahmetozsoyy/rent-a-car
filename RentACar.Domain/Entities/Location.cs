using RentACar.Domain.Common;

namespace RentACar.Domain.Entities;

public class Location : BaseEntity
{
    public string Name { get; private set; }
    public string Address { get; private set; }
    public string City { get; private set; }
    public int Capacity { get; private set; }

    public ICollection<Vehicle> Vehicles { get; private set; } = new List<Vehicle>();

    protected Location() { } // EF Core requires parameterless constructor

    public Location(string name, string address, string city, int capacity)
    {
        Name = name;
        Address = address;
        City = city;
        Capacity = capacity;
    }
}
