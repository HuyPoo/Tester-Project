using System.Security.Claims;
using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("appointments")]
public class AppointmentController(
    IAppointmentService appointmentService,
    IAuthorizationService authorizationService
) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetAppointments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var response = await appointmentService.GetAppointmentsAsync(page, pageSize);
        return Ok(response);
    }

    [HttpGet("{appointmentId:guid}")]
    [Authorize(Policy = Policies.AppointmentAccess)]
    public async Task<IActionResult> GetAppointment(Guid appointmentId)
    {
        var appointment = await appointmentService.GetAppointmentAsync(appointmentId);
        if (appointment == null)
        {
            return NotFound();
        }

        var authorizationResult =
            await authorizationService.AuthorizeAsync(User, appointment, Policies.AppointmentAccess);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        return Ok(appointment);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Customer)]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var response = await appointmentService.CreateAppointmentAsync(Guid.Parse(userId), request);
        return CreatedAtAction(nameof(GetAppointment), new { appointmentId = response.Id }, response);
    }

    [HttpPost("{appointmentId:guid}/cancel")]
    [Authorize(Roles = Roles.Customer)]
    public async Task<IActionResult> CancelAppointmentForCustomer(
        Guid appointmentId,
        [FromBody] CancelAppointmentRequest request)
    {
        var appointment = await appointmentService.GetAppointmentAsync(appointmentId);
        if (appointment == null)
        {
            return NotFound();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        if (appointment.CustomerId.ToString() != userId)
        {
            return Forbid();
        }

        var response = await appointmentService.CancelAppointmentForCustomerAsync(appointmentId, request);
        return Ok(response);
    }

    [HttpPut("{appointmentId:guid}/status")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> UpdateAppointmentStatus(
        Guid appointmentId,
        [FromBody] UpdateAppointmentStatusRequest request)
    {
        var appointment = await appointmentService.GetAppointmentAsync(appointmentId);
        if (appointment == null)
        {
            return NotFound();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        if (appointment.StylistId.ToString() != userId && !User.IsInRole(Roles.Manager))
        {
            return Forbid();
        }

        var response = await appointmentService.UpdateAppointmentStatusAsync(appointmentId, request);
        return Ok(response);
    }
}