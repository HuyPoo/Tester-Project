using Business.Interfaces;
using Business.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Business;

public static class BusinessServices
{
    public static void AddBusinessServices(this IServiceCollection services)
    {
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<ISalonService, SalonService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IStylistService, StylistService>();

        services.AddTransient<IEmailService, EmailService>();

        services.AddScoped<IStatsService, StatsService>();
    }
}