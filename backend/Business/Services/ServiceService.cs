using AutoMapper;
using Business.DTOs;
using Business.Interfaces;
using Persistence.Entities;
using Persistence.Interfaces;

namespace Business.Services;

public class ServiceService(
    IServiceRepository serviceRepository,
    IMapper mapper
) : IServiceService
{
    public async Task<IEnumerable<ServiceResponse>> GetServicesAsync(int page, int pageSize)
    {
        var services = await serviceRepository.FindAllAsync(page, pageSize);
        return mapper.Map<IEnumerable<ServiceResponse>>(services);
    }

    public async Task<ServiceResponse?> GetServiceAsync(Guid serviceId)
    {
        var service = await serviceRepository.FindByIdAsync(serviceId);
        return mapper.Map<ServiceResponse?>(service);
    }

    public async Task<ServiceResponse> CreateServiceAsync(CreateServiceRequest request)
    {
        var service = mapper.Map<Service>(request);
        await serviceRepository.AddAsync(service);
        return mapper.Map<ServiceResponse>(service);
    }

    public async Task<ServiceResponse?> UpdateServiceAsync(Guid serviceId, UpdateServiceRequest request)
    {
        var service = await serviceRepository.FindByIdAsync(serviceId);
        if (service == null)
        {
            return null;
        }

        mapper.Map(request, service);
        await serviceRepository.UpdateAsync(service);
        return mapper.Map<ServiceResponse>(service);
    }

    public async Task DeleteServiceAsync(Guid serviceId)
    {
        var service = await serviceRepository.FindByIdAsync(serviceId);
        if (service == null)
        {
            return;
        }

        await serviceRepository.DeleteAsync(service);
    }

    public async Task<IEnumerable<StylistResponse>> GetServiceStylistsAsync(Guid serviceId, int page, int pageSize)
    {
        var stylists = await serviceRepository.GetServiceStylistsAsync(serviceId, page, pageSize);
        return mapper.Map<IEnumerable<StylistResponse>>(stylists);
    }

    public async Task AddServiceStylistAsync(Guid serviceId, Guid stylistId)
    {
        await serviceRepository.AddServiceStylistAsync(serviceId, stylistId);
    }

    public async Task RemoveServiceStylistAsync(Guid serviceId, Guid stylistId)
    {
        await serviceRepository.RemoveServiceStylistAsync(serviceId, stylistId);
    }
}