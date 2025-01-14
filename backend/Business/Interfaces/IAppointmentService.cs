using Business.DTOs;

namespace Business.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentResponse>> GetAppointmentsAsync(int page, int pageSize);

    Task<AppointmentResponse?> GetAppointmentAsync(Guid appointmentId);

    Task<AppointmentResponse> CreateAppointmentAsync(Guid userId, CreateAppointmentRequest request);

    Task<AppointmentResponse?> UpdateAppointmentStatusAsync(
        Guid appointmentId,
        UpdateAppointmentStatusRequest request);

    Task<AppointmentResponse?> CancelAppointmentForCustomerAsync(
        Guid appointmentId,
        CancelAppointmentRequest request);
}