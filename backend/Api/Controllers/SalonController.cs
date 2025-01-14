using Business.DTOs;
using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Models;

namespace Api.Controllers;

[ApiController]
[Route("salon")]
public class SalonController(ISalonService salonService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<SalonResponse>> GetSalon()
    {
        var response = await salonService.GetSalonAsync();
        return Ok(response);
    }

    [HttpPut]
    [Authorize(Roles = Roles.Manager)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SalonResponse>> UpdateSalon([FromBody] UpdateSalonRequest request)
    {
        var response = await salonService.UpdateSalonAsync(request);
        return Ok(response);
    }
}