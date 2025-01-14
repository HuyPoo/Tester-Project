using System.ComponentModel.DataAnnotations;

namespace Business.DTOs;

public record StylistResponse(
    Guid Id,
    string Email,
    string PhoneNumber,
    string FirstName,
    string LastName,
    List<string>? Specialties,
    string? Bio,
    string? ImageUrl
);

public record CreateStylistRequest(
    [EmailAddress]
    string Email,
    [Phone]
    string PhoneNumber,
    [StringLength(50, MinimumLength = 2)]
    string FirstName,
    [StringLength(50, MinimumLength = 2)]
    string LastName,
    [StringLength(50, MinimumLength = 2)]
    string? Specialization,
    [StringLength(128)]
    string? Bio,
    [StringLength(256)]
    string? ImageUrl
);

public record UpdateStylistRequest(
    [Phone]
    string PhoneNumber,
    [StringLength(50, MinimumLength = 2)]
    string FirstName,
    [StringLength(50, MinimumLength = 2)]
    string LastName,
    List<string>? Specialties,
    [StringLength(128)]
    string? Bio,
    [StringLength(256)]
    string? ImageUrl
);

public record ServiceSlots(
    Guid StylistId,
    Guid ServiceId,
    DateOnly Date,
    IEnumerable<Tuple<DateTime, bool>> Slots
);