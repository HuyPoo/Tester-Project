namespace Business.DTOs;

public record AppointmentStats(
    DateTime StartDate,
    DateTime EndDate,
    int TotalAppointments,
    Guid? StylistId = null);

public record RevenueStats(
    DateTime StartDate,
    DateTime EndDate,
    decimal TotalRevenue,
    Guid? StylistId = null);