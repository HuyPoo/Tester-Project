using Business.DTOs;

namespace Business.Interfaces;

public interface IServiceService
{
    Task<IEnumerable<ServiceResponse>> GetServicesAsync(int page, int pageSize);

    Task<ServiceResponse?> GetServiceAsync(Guid serviceId);

    Task<ServiceResponse> CreateServiceAsync(CreateServiceRequest request);

    Task<ServiceResponse?> UpdateServiceAsync(Guid serviceId, UpdateServiceRequest request);

    Task DeleteServiceAsync(Guid serviceId);
    Task<IEnumerable<StylistResponse>> GetServiceStylistsAsync(Guid serviceId, int page, int pageSize);
    Task AddServiceStylistAsync(Guid serviceId, Guid stylistId);
    Task RemoveServiceStylistAsync(Guid serviceId, Guid stylistId);
}