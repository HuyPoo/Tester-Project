using Persistence.Entities;

namespace Persistence.Interfaces;

public interface IServiceRepository : IRepository<Service, Guid>
{
    Task<IEnumerable<User>> GetServiceStylistsAsync(Guid serviceId, int page, int pageSize);

    Task AddServiceStylistAsync(Guid serviceId, Guid stylistId);

    Task RemoveServiceStylistAsync(Guid serviceId, Guid stylistId);
}