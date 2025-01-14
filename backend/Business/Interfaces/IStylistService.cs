using Business.DTOs;

namespace Business.Interfaces;

public interface IStylistService
{
    Task<IEnumerable<StylistResponse>> GetStylistsAsync(int page, int pageSize);
    Task<StylistResponse?> GetStylistAsync(Guid id);
    Task<StylistResponse> CreateStylistAsync(CreateStylistRequest request);
    Task<StylistResponse?> UpdateStylistAsync(Guid id, UpdateStylistRequest request);
    Task<IEnumerable<ServiceResponse>> GetStylistServicesAsync(Guid stylistId, int page, int pageSize);

    Task<IEnumerable<AppointmentResponse>> GetStylistAppointmentsAsync(
        Guid stylistId,
        bool all,
        int page,
        int pageSize
    );

    Task<ServiceSlots> GetStylistServiceSlotsAsync(
        Guid stylistId,
        Guid serviceId,
        DateOnly date
    );
}