using System.ComponentModel.DataAnnotations;

namespace Business.DTOs;

public record CustomerResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber
);

public record UpdateCustomerRequest(
    [StringLength(50, MinimumLength = 2)]
    string FirstName,
    [StringLength(50, MinimumLength = 2)]
    string LastName,
    [Phone]
    string PhoneNumber
);