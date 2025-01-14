using System.Security.Claims;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("stats")]
public class StatsController(IStatsService statsService) : ControllerBase
{
    [HttpGet("appointments")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> GetAppointmentsStats(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userRole == Roles.Stylist && userId == null)
        {
            return Forbid();
        }

        var stylistId = userId != null && userRole == Roles.Stylist ? Guid.Parse(userId) : (Guid?)null;
        var response = await statsService.GetAppointmentsStatsAsync(stylistId, startDate, endDate);
        return Ok(response);
    }

    [HttpGet("revenue")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> GetRevenueStats(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userRole == Roles.Stylist && userId == null)
        {
            return Forbid();
        }

        var stylistId = userId != null && userRole == Roles.Stylist ? Guid.Parse(userId) : (Guid?)null;
        var response = await statsService.GetRevenueStatsAsync(stylistId, startDate, endDate);
        return Ok(response);
    }
}