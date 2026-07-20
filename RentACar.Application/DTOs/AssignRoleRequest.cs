namespace RentACar.Application.DTOs;
using System;

public class AssignRoleRequest
{
    public string Email { get; set; }
    public Guid LocationId { get; set; }
}
