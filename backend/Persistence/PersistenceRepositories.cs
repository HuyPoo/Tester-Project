using Microsoft.Extensions.DependencyInjection;
using Persistence.Interfaces;
using Persistence.Repositories;

namespace Persistence;

public static class PersistenceRepositories
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ISalonRepository, SalonRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IStylistRepository, StylistRepository>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
    }
}