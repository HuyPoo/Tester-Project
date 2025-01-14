using System.ComponentModel.DataAnnotations;

namespace Business.DTOs;

public record UpdateSalonRequest(
    [StringLength(50, MinimumLength = 2)]
    string Name,
    [Phone]
    string PhoneNumber,
    [EmailAddress]
    string Email,
    [StringLength(256, MinimumLength = 2)]
    string Address,
    TimeOnly OpeningTime,
    TimeOnly ClosingTime,
    [Range(1, 55)]
    int LeadWeeks
);

public record SalonResponse(
    string Name,
    string Description,
    string PhoneNumber,
    string Email,
    string Address,
    TimeOnly OpeningTime,
    TimeOnly ClosingTime,
    int LeadWeeks
);