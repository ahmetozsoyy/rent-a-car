using Microsoft.AspNetCore.SignalR;

namespace RentACar.Api.Hubs
{
    public class NotificationHub : Hub
    {
        // Simple hub for now. Clients connect and the backend pushes messages to all.
    }
}
