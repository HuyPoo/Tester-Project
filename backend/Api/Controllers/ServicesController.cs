using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("services")]
public class ServicesController(
    IServiceService serviceService
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetServices(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var response = await serviceService.GetServicesAsync(page, pageSize);
        return Ok(response);
    }

    [HttpGet("{serviceId:guid}")]
    public async Task<IActionResult> GetService(Guid serviceId)
    {
        var response = await serviceService.GetServiceAsync(serviceId);
        if (response == null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Manager)]
    public async Task<ActionResult> CreateService([FromBody] CreateServiceRequest request)
    {
        var response = await serviceService.CreateServiceAsync(request);
        return CreatedAtAction(nameof(GetService), new { serviceId = response.Id }, response);
    }

    [HttpPut("{serviceId:guid}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> UpdateService(
        Guid serviceId,
        [FromBody] UpdateServiceRequest request)
    {
        var response = await serviceService.UpdateServiceAsync(serviceId, request);
        if (response == null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpGet("{serviceId:guid}/stylists")]
    public async Task<IActionResult> GetServiceStylists(
        Guid serviceId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var response = await serviceService.GetServiceStylistsAsync(serviceId, page, pageSize);
        return Ok(response);
    }

    [HttpPut("{serviceId:guid}/stylists/{stylistId:guid}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> AddServiceStylist(
        Guid serviceId,
        Guid stylistId)
    {
        await serviceService.AddServiceStylistAsync(serviceId, stylistId);
        return NoContent();
    }

    [HttpDelete("{serviceId:guid}/stylists/{stylistId:guid}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> RemoveServiceStylist(
        Guid serviceId,
        Guid stylistId)
    {
        await serviceService.RemoveServiceStylistAsync(serviceId, stylistId);
        return NoContent();
    }
}