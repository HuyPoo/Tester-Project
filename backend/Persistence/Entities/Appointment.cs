using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Persistence.Models.Enumerations;

namespace Persistence.Entities;

public class Appointment
{
    public Guid Id { get; private set; }

    public string CustomerId { get; set; }

    [ForeignKey(nameof(CustomerId))]
    public required User Customer { get; set; }

    public string StylistId { get; set; }

    [ForeignKey(nameof(StylistId))]
    public required User Stylist { get; set; }

    public Guid ServiceId { get; set; }

    [ForeignKey(nameof(ServiceId))]
    public required Service Service { get; set; }

    public required DateTime DateTime { get; set; }

    [Column(TypeName = "varchar(16)")]
    public required AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    [Precision(10, 2)]
    public decimal TotalPrice { get; set; }

    [MaxLength(128)]
    public string? CustomerNotes { get; set; }

    [MaxLength(128)]
    public string? StylistNotes { get; set; }
}