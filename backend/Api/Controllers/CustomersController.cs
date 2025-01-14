using System.Security.Claims;
using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("customers")]
public class CustomersController(ICustomerService customerService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var users = await customerService.GetCustomersAsync(page, pageSize);
        return Ok(users);
    }

    [HttpGet("{customerId:guid}")]
    [Authorize(Policy = Policies.StylistsOrManagers)]
    public async Task<IActionResult> GetCustomer(Guid customerId)
    {
        var user = await customerService.GetCustomerAsync(customerId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("{customerId:guid}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<ActionResult> UpdateCustomer(Guid customerId, [FromBody] UpdateCustomerRequest request)
    {
        var user = await customerService.UpdateCustomerAsync(customerId, request);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet("me")]
    [Authorize(Roles = Roles.Customer)]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        var user = await customerService.GetCustomerAsync(Guid.Parse(userId));
        if (user == null)
        {
            return Forbid();
        }

        return Ok(user);
    }

    [HttpPut("me")]
    [Authorize(Roles = Roles.Customer)]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateCustomerRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Forbid();
        }

        var user = await customerService.UpdateCustomerAsync(Guid.Parse(userId), request);
        if (user == null)
        {
            return Forbid();
        }

        return Ok(user);
    }

    [HttpGet("{customerId:guid}/appointments")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetCustomerAppointments(
        Guid customerId,
        [FromQuery] bool all = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var appointments = await customerService.GetCustomerAppointmentsAsync(customerId, all, page, pageSize);
        return Ok(appointments);
    }

    [HttpGet("me/appointments")]
    [Authorize(Roles = Roles.Customer)]
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

        var appointments = await customerService.GetCustomerAppointmentsAsync(Guid.Parse(userId), all, page, pageSize);
        return Ok(appointments);
    }
}