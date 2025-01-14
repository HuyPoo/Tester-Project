using Persistence.Models.Enumerations;

namespace Business.DTOs;

public record CreateAppointmentRequest(
    Guid StylistId,
    Guid ServiceId,
    DateTime DateTime,
    string? Notes
);

public record UpdateAppointmentStatusRequest(
    AppointmentStatus Status,
    string? Notes
);

public record RescheduleAppointmentRequest(
    DateTime DateTime,
    string? Notes
);

public record CancelAppointmentRequest(
    string Reason
);

public record AppointmentResponse(
    Guid Id,
    Guid CustomerId,
    Guid StylistId,
    Guid ServiceId,
    DateTime DateTime,
    AppointmentStatus Status,
    string? CustomerNotes,
    string? StylistNotes,
    decimal TotalPrice
);