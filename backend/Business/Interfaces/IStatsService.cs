using Business.DTOs;

namespace Business.Interfaces;

public interface IStatsService
{
    Task<AppointmentStats> GetAppointmentsStatsAsync(Guid? stylistId, DateTime startDate, DateTime endDate);
    Task<RevenueStats> GetRevenueStatsAsync(Guid? stylistId, DateTime startDate, DateTime endDate);
}