namespace RentACar.Application.DTOs;

public record SendMessageRequest(string SenderName, string Content);

public record AdminSendMessageRequest(Guid LocationId, string Content);

public record SupportMessageDto(
    Guid Id,
    Guid LocationId,
    string LocationName,
    string SenderName,
    string Content,
    bool IsFromAdmin,
    DateTime CreatedAt
);
