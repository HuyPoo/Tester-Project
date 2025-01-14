using System.ComponentModel.DataAnnotations;

namespace Business.DTOs;

public record ServiceResponse(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int DurationMinutes,
    string? ImageUrl = null
);

public record CreateServiceRequest(
    [StringLength(50, MinimumLength = 2)]
    string Name,
    [StringLength(256, MinimumLength = 2)]
    string Description,
    decimal Price,
    int DurationMinutes,
    [StringLength(256)]
    string? ImageUrl = null
);

public record UpdateServiceRequest(
    [StringLength(50, MinimumLength = 2)]
    string Name,
    [StringLength(256, MinimumLength = 2)]
    string Description,
    decimal Price,
    int DurationMinutes,
    [StringLength(256)]
    string? ImageUrl
);