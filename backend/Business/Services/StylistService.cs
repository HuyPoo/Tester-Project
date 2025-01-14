using System.Web;
using AutoMapper;
using Business.DTOs;
using Business.Exceptions;
using Business.Interfaces;
using Business.Settings;
using Microsoft.AspNetCore.Identity;
using Persistence.Entities;
using Persistence.Interfaces;
using Persistence.Models;

namespace Business.Services;

public class StylistService(
    IStylistRepository stylistRepository,
    UserManager<User> userManager,
    IMapper mapper,
    IEmailService emailService,
    EmailSettings emailSettings
) : IStylistService
{
    public async Task<IEnumerable<StylistResponse>> GetStylistsAsync(int page, int pageSize)
    {
        var stylists = await stylistRepository.FindAllAsync(page, pageSize);
        return mapper.Map<IEnumerable<StylistResponse>>(stylists);
    }

    public async Task<StylistResponse?> GetStylistAsync(Guid id)
    {
        var stylist = await stylistRepository.FindByIdAsync(id.ToString());
        return mapper.Map<StylistResponse?>(stylist);
    }

    public async Task<StylistResponse> CreateStylistAsync(CreateStylistRequest request)
    {
        var user = mapper.Map<User>(request);
        user.EmailConfirmed = true;
        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            throw HttpResponseException.BadRequest(result.Errors, "Failed to create stylist");
        }

        await userManager.AddToRoleAsync(user, Roles.Stylist);

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetPasswordUrl =
            $"{emailSettings.FrontEndHost}/reset-password?email={user.Email}&token={HttpUtility.UrlEncode(token)}";

        await emailService.SendEmailAsync(request.Email, "Set your password", resetPasswordUrl);

        return mapper.Map<StylistResponse>(user);
    }

    public async Task<StylistResponse?> UpdateStylistAsync(Guid id, UpdateStylistRequest request)
    {
        var stylist = await stylistRepository.FindByIdAsync(id.ToString());
        if (stylist == null)
        {
            return null;
        }

        mapper.Map(request, stylist);
        await stylistRepository.UpdateAsync(stylist);

        return mapper.Map<StylistResponse>(stylist);
    }

    public async Task<IEnumerable<ServiceResponse>> GetStylistServicesAsync(Guid stylistId, int page, int pageSize)
    {
        var services = await stylistRepository.GetStylistServicesAsync(stylistId, page, pageSize);
        return mapper.Map<IEnumerable<ServiceResponse>>(services);
    }

    public async Task<IEnumerable<AppointmentResponse>> GetStylistAppointmentsAsync(
        Guid stylistId,
        bool all,
        int page,
        int pageSize
    )
    {
        var appointments = all
            ? stylistRepository.GetStylistAppointmentsAsync(stylistId, page, pageSize)
            : stylistRepository.GetStylistUpcomingAppointmentsAsync(stylistId, page, pageSize);

        return mapper.Map<IEnumerable<AppointmentResponse>>(await appointments);
    }

    public async Task<ServiceSlots> GetStylistServiceSlotsAsync(
        Guid stylistId,
        Guid serviceId,
        DateOnly date
    )
    {
        var slots = await stylistRepository.GetServiceSlotsAsync(stylistId, serviceId, date);
        return new ServiceSlots
        (
            StylistId: stylistId,
            ServiceId: serviceId,
            Date: date,
            Slots: slots
        );
    }
}