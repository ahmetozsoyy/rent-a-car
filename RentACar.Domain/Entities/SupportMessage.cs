using RentACar.Domain.Common;

namespace RentACar.Domain.Entities;

public class SupportMessage : BaseEntity
{
    public Guid LocationId { get; private set; }
    public string SenderName { get; private set; }
    public string Content { get; private set; }
    public bool IsFromAdmin { get; private set; }

    public Location Location { get; private set; }

    protected SupportMessage() { }

    public SupportMessage(Guid locationId, string senderName, string content, bool isFromAdmin)
    {
        LocationId = locationId;
        SenderName = senderName;
        Content = content;
        IsFromAdmin = isFromAdmin;
    }
}
