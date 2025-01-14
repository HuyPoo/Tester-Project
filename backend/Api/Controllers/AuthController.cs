using System.Security.Claims;
using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await authService.LoginAsync(request);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        await authService.RegisterAsync(request);
        return Created(string.Empty, null);
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        await authService.ConfirmEmailAsync(request);
        return NoContent();
    }

    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailRequest request)
    {
        await authService.ResendConfirmationEmailAsync(request);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await authService.ForgotPasswordAsync(request);
        return NoContent();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        await authService.ResetPasswordAsync(request);
        return NoContent();
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        await authService.ChangePasswordAsync(Guid.Parse(userId), request);
        return NoContent();
    }
}