using Business.DTOs;
using Business.Interfaces;
using Persistence.Interfaces;

namespace Business.Services;

public class StatsService(IAppointmentRepository appointmentRepository) : IStatsService
{
    public async Task<AppointmentStats> GetAppointmentsStatsAsync(Guid? stylistId, DateTime startDate, DateTime endDate)
    {
        var totalAppointments = await appointmentRepository.CountAsync(stylistId, startDate, endDate);
        return new AppointmentStats(
            StartDate: startDate,
            EndDate: endDate,
            TotalAppointments: totalAppointments,
            StylistId: stylistId
        );
    }

    public async Task<RevenueStats> GetRevenueStatsAsync(Guid? stylistId, DateTime startDate, DateTime endDate)
    {
        var totalRevenue = await appointmentRepository.GetTotalRevenueAsync(stylistId, startDate, endDate);
        return new RevenueStats(
            StartDate: startDate,
            EndDate: endDate,
            TotalRevenue: totalRevenue,
            StylistId: stylistId
        );
    }
}