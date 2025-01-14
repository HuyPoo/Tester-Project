using Business.DTOs;

namespace Business.Interfaces;

public interface ICustomerService
{
    Task<IEnumerable<CustomerResponse>> GetCustomersAsync(int page, int pageSize);

    Task<CustomerResponse?> GetCustomerAsync(Guid customerId);

    Task<CustomerResponse?> UpdateCustomerAsync(Guid customerId, UpdateCustomerRequest request);

    Task<IEnumerable<AppointmentResponse>> GetCustomerAppointmentsAsync(
        Guid customerId,
        bool all,
        int page,
        int pageSize
    );
}