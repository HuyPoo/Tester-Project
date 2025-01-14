using AutoMapper;
using Business.DTOs;
using Business.Interfaces;
using Persistence.Interfaces;

namespace Business.Services;

public class CustomerService(ICustomerRepository customerRepository, IMapper mapper) : ICustomerService
{
    public async Task<IEnumerable<CustomerResponse>> GetCustomersAsync(int page, int pageSize)
    {
        var users = await customerRepository.FindAllAsync(page, pageSize);
        return mapper.Map<IEnumerable<CustomerResponse>>(users);
    }

    public async Task<CustomerResponse?> GetCustomerAsync(Guid customerId)
    {
        var user = await customerRepository.FindByIdAsync(customerId.ToString());
        return mapper.Map<CustomerResponse?>(user);
    }

    public async Task<CustomerResponse?> UpdateCustomerAsync(Guid customerId, UpdateCustomerRequest request)
    {
        var user = await customerRepository.FindByIdAsync(customerId.ToString());
        if (user == null)
        {
            return null;
        }

        mapper.Map(request, user);
        await customerRepository.UpdateAsync(user);
        return mapper.Map<CustomerResponse?>(user);
    }

    public async Task<IEnumerable<AppointmentResponse>> GetCustomerAppointmentsAsync(
        Guid customerId,
        bool all,
        int page,
        int pageSize)
    {
        var appointments = all
            ? customerRepository.FindAllAppointmentsAsync(customerId, page, pageSize)
            : customerRepository.FindUpcomingAppointmentsAsync(customerId, page, pageSize);

        return mapper.Map<IEnumerable<AppointmentResponse>>(await appointments);
    }
}