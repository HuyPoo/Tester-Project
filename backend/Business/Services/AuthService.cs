using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Web;
using AutoMapper;
using Business.DTOs;
using Business.Exceptions;
using Business.Interfaces;
using Business.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence.Entities;
using Persistence.Models;

namespace Business.Services;

public class AuthService(
    UserManager<User> userManager,
    IMapper mapper,
    JwtSettings jwtSettings,
    IEmailService emailService,
    EmailSettings emailSettings
) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (!await userManager.IsEmailConfirmedAsync(user))
        {
            throw new UnauthorizedAccessException("Email not confirmed");
        }

        var (token, expires, role) = await GenerateJwtToken(user);
        return new AuthResponse(token, expires, Guid.Parse(user.Id), role);
    }

    public async Task RegisterAsync(RegisterRequest request)
    {
        var user = mapper.Map<User>(request);
        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw HttpResponseException.BadRequest(result.Errors, "Failed to register user");
        }

        await userManager.AddToRoleAsync(user, Roles.Customer);
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmationUrl = $"{emailSettings.FrontEndHost}/verify-email?email=" + user.Email + "&token=" +
                              HttpUtility.UrlEncode(token);

        await emailService.SendEmailAsync(request.Email, "Confirm your email", confirmationUrl);
    }

    public async Task ConfirmEmailAsync(ConfirmEmailRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw HttpResponseException.NotFound("User not found");
        }

        var result = await userManager.ConfirmEmailAsync(user, request.Token);
        if (result.Succeeded)
        {
            return;
        }

        throw HttpResponseException.BadRequest(result.Errors, "Failed to confirm email");
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null || !await userManager.IsEmailConfirmedAsync(user))
        {
            return;
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var resetPasswordUrl =
            $"{emailSettings.FrontEndHost}/reset-password?email={user.Email}&token={HttpUtility.UrlEncode(token)}";

        await emailService.SendEmailAsync(request.Email, "Reset your password", resetPasswordUrl);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            throw HttpResponseException.NotFound("User not found");
        }

        var result = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (result.Succeeded)
        {
            return;
        }

        throw HttpResponseException.BadRequest(result.Errors, "Failed to change password");
    }

    public async Task ResendConfirmationEmailAsync(ResendConfirmationEmailRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw HttpResponseException.NotFound("User not found");
        }

        if (await userManager.IsEmailConfirmedAsync(user))
        {
            return;
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmationUrl =
            $"{emailSettings.FrontEndHost}/verify-email?email={user.Email}&token={HttpUtility.UrlEncode(token)}";

        await emailService.SendEmailAsync(request.Email, "Confirm your email", confirmationUrl);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw HttpResponseException.NotFound("User not found");
        }

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (result.Succeeded)
        {
            return;
        }

        throw HttpResponseException.BadRequest(result.Errors, "Failed to reset password");
    }

    private async Task<Tuple<string, DateTime, string>> GenerateJwtToken(User user)
    {
        var role = (await userManager.GetRolesAsync(user)).FirstOrDefault(Roles.Customer);
        var expires = DateTime.UtcNow.AddMinutes(jwtSettings.AccessTokenExpirationInMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Exp, expires.ToString(CultureInfo.InvariantCulture)),
            new(ClaimTypes.Role, role)
        };

        var creds = new SigningCredentials(jwtSettings.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return Tuple.Create(new JwtSecurityTokenHandler().WriteToken(token), expires, role);
    }
}