using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Persistence.Entities;

public class User : IdentityUser
{
    // Common attributes
    [MaxLength(50)]
    public required string FirstName { get; set; }

    [MaxLength(50)]
    public required string LastName { get; set; }

    // Stylist attributes

    public List<string>? Specialties { get; set; }

    [MaxLength(128)]
    public string? Bio { get; set; }

    [MaxLength(256)]
    public string? ImageUrl { get; set; }

    public ICollection<Service> Services { get; set; } = null!;

    // Appointments

    public ICollection<Appointment> CustomerAppointments { get; set; } = null!;

    public ICollection<Appointment> StylistAppointments { get; set; } = null!;
}