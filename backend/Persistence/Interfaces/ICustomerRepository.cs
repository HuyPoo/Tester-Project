using Persistence.Entities;

namespace Persistence.Interfaces;

public interface ICustomerRepository : IRepository<User, string>
{
    Task<IEnumerable<Appointment>> FindAllAppointmentsAsync(Guid customerId, int page, int pageSize);

    Task<IEnumerable<Appointment>> FindUpcomingAppointmentsAsync(Guid customerId, int page, int pageSize);
}