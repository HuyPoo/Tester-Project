using System.Security.Claims;
using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("stylists")]
[Produces("application/json")]
public class StylistsController(IStylistService stylistService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetStylists([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var stylists = await stylistService.GetStylistsAsync(page, pageSize);
        return Ok(stylists);
    }

    [HttpGet("{stylistId:guid}")]
    public async Task<IActionResult> GetStylist(Guid stylistId)
    {
        var stylist = await stylistService.GetStylistAsync(stylistId);
        if (stylist == null)
        {
            return NotFound();
        }

        return Ok(stylist);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> CreateStylist([FromBody] CreateStylistRequest request)
    {
        var response = await stylistService.CreateStylistAsync(request);
        return CreatedAtAction(nameof(GetStylist), new { stylistId = response.Id }, response);
    }

    [HttpPut("{stylistId:guid}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> UpdateStylist(
        Guid stylistId,
        [FromBody] UpdateStylistRequest request)
    {
        var stylist = await stylistService.UpdateStylistAsync(stylistId, request);
        if (stylist == null)
        {
            return NotFound();
        }

        return Ok(stylist);
    }

    [HttpGet("me")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        var stylist = await stylistService.GetStylistAsync(Guid.Parse(userId));
        if (stylist == null)
        {
            return Forbid();
        }

        return Ok(stylist);
    }

    [HttpPut("me")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateStylistRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        var stylist = await stylistService.UpdateStylistAsync(Guid.Parse(userId), request);
        if (stylist == null)
        {
            return Forbid();
        }

        return Ok(stylist);
    }

    [HttpGet("{stylistId:guid}/services")]
    public async Task<IActionResult> GetStylistServices(
        Guid stylistId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var services = await stylistService.GetStylistServicesAsync(stylistId, page, pageSize);
        return Ok(services);
    }

    [HttpGet("{stylistId:guid}/appointments")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetStylistAppointments(
        Guid stylistId,
        [FromQuery] bool all = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var appointments = await stylistService.GetStylistAppointmentsAsync(stylistId, all, page, pageSize);
        return Ok(appointments);
    }

    [HttpGet("me/appointments")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> GetMyAppointments(
        [FromQuery] bool all = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        var appointments = await stylistService.GetStylistAppointmentsAsync(Guid.Parse(userId), all, page, pageSize);
        return Ok(appointments);
    }

    [HttpGet("{stylistId:guid}/services/{serviceId:guid}/slots")]
    [Authorize]
    public async Task<IActionResult> GetStylistSchedule(
        Guid stylistId,
        Guid serviceId,
        [FromQuery] DateOnly date)
    {
        var schedule = await stylistService.GetStylistServiceSlotsAsync(stylistId, serviceId, date);
        return Ok(schedule);
    }
}