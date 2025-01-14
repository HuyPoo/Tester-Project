using AutoMapper;
using Business.DTOs;
using Business.Interfaces;
using Persistence.Entities;
using Persistence.Interfaces;

namespace Business.Services;

public class SalonService(
    ISalonRepository salonRepository,
    IMapper mapper
) : ISalonService
{
    public async Task<SalonResponse> GetSalonAsync()
    {
        var salon = await salonRepository.GetSalonAsync();
        return mapper.Map<SalonResponse>(salon);
    }

    public Task<SalonResponse> UpdateSalonAsync(UpdateSalonRequest request)
    {
        var salon = mapper.Map<Salon>(request);
        salonRepository.UpdateAsync(salon);
        return Task.FromResult(mapper.Map<SalonResponse>(salon));
    }
}