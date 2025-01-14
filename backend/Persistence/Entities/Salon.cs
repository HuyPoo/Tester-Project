using System.ComponentModel.DataAnnotations;

namespace Persistence.Entities;

public class Salon
{
    public Guid Id { get; private set; }

    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(256)]
    public required string Description { get; set; }

    [MaxLength(256)]
    public required string Address { get; set; }

    [MaxLength(20)]
    public required string PhoneNumber { get; set; }

    [MaxLength(128)]
    public required string Email { get; set; }

    public TimeOnly OpeningTime { get; set; }
    public TimeOnly ClosingTime { get; set; }

    public int LeadWeeks { get; set; }
}