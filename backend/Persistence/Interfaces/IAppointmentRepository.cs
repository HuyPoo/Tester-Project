using Persistence.Entities;

namespace Persistence.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment, Guid>
{
    Task<Appointment?> FindByIdWithRelatedEntitiesAsync(Guid id);

    Task<int> CountAsync(Guid? stylistId, DateTime? startDate, DateTime? endDate);

    Task<decimal> GetTotalRevenueAsync(Guid? stylistId, DateTime? startDate, DateTime? endDate);
}