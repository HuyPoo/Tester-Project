using Business.DTOs;

namespace Business.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task RegisterAsync(RegisterRequest request);

    Task ConfirmEmailAsync(ConfirmEmailRequest request);
    Task ForgotPasswordAsync(ForgotPasswordRequest request);
    Task ResetPasswordAsync(ResetPasswordRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task ResendConfirmationEmailAsync(ResendConfirmationEmailRequest request);
}