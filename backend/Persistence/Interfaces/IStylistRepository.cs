using Persistence.Entities;

namespace Persistence.Interfaces;

public interface IStylistRepository : IRepository<User, string>
{
    Task<IEnumerable<Service>> GetStylistServicesAsync(Guid stylistId, int page, int pageSize);
    Task<IEnumerable<Appointment>> GetStylistAppointmentsAsync(Guid stylistId, int page, int pageSize);
    Task<IEnumerable<Appointment>> GetStylistUpcomingAppointmentsAsync(Guid stylistId, int page, int pageSize);

    Task<IEnumerable<Tuple<DateTime, bool>>> GetServiceSlotsAsync(
        Guid stylistId,
        Guid serviceId,
        DateOnly date);
}