using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Entities;

public class Service
{
    public Guid Id { get; private set; }

    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(256)]
    public required string Description { get; set; }

    [MaxLength(256)]
    public string? ImageUrl { get; set; }

    [Precision(10, 2)]
    public decimal Price { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsDeleted { get; set; } = false;

    public ICollection<User> Stylists { get; set; } = null!;
}