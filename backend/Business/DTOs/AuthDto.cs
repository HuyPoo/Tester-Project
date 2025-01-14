using System.ComponentModel.DataAnnotations;

namespace Business.DTOs;

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string AccessToken,
    DateTime Expires,
    Guid UserId,
    string Role
);

public record RegisterRequest(
    [StringLength(50, MinimumLength = 2)]
    string FirstName,
    [StringLength(50, MinimumLength = 2)]
    string LastName,
    [EmailAddress]
    string Email,
    [StringLength(32, MinimumLength = 6)]
    string Password,
    [Phone]
    string PhoneNumber
);

public record ConfirmEmailRequest(
    [EmailAddress]
    string Email,
    string Token
);

public record ChangePasswordRequest(
    [StringLength(32, MinimumLength = 6)]
    string OldPassword,
    [StringLength(32, MinimumLength = 6)]
    string NewPassword
);

public record ForgotPasswordRequest(
    [EmailAddress]
    string Email
);

public record ResetPasswordRequest(
    [EmailAddress]
    string Email,
    string Token,
    [StringLength(32, MinimumLength = 6)]
    string NewPassword
);

public record ResendConfirmationEmailRequest(
    [EmailAddress]
    string Email
);