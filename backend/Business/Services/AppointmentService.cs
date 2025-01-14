using AutoMapper;
using Business.DTOs;
using Business.Exceptions;
using Business.Interfaces;
using Persistence.Entities;
using Persistence.Interfaces;
using Persistence.Models.Enumerations;

namespace Business.Services;

public class AppointmentService(
    IAppointmentRepository appointmentRepository,
    IServiceRepository serviceRepository,
    ICustomerRepository customerRepository,
    IStylistRepository stylistRepository,
    ISalonRepository salonRepository,
    IMapper mapper,
    IEmailService emailService
) : IAppointmentService
{
    private static bool IsUnmodifiableStatus(AppointmentStatus status) =>
        status is AppointmentStatus.Completed or AppointmentStatus.Cancelled or AppointmentStatus.NoShow;

    public async Task<IEnumerable<AppointmentResponse>> GetAppointmentsAsync(int page, int pageSize)
    {
        var appointments = await appointmentRepository.FindAllAsync(page, pageSize);
        return mapper.Map<IEnumerable<AppointmentResponse>>(appointments);
    }

    public async Task<AppointmentResponse?> GetAppointmentAsync(Guid appointmentId)
    {
        var appointment = await appointmentRepository.FindByIdAsync(appointmentId);
        return mapper.Map<AppointmentResponse?>(appointment);
    }

    public async Task<AppointmentResponse> CreateAppointmentAsync(Guid userId, CreateAppointmentRequest request)
    {
        var salon = await salonRepository.GetSalonAsync();
        var requestDateTime = request.DateTime;
        var now = DateTime.Now;
        if (requestDateTime > now.AddDays(salon.LeadWeeks * 7))
        {
            throw HttpResponseException.BadRequest(
                $"Cannot book an appointment more than {salon.LeadWeeks} weeks in advance");
        }

        var requestDate = DateOnly.FromDateTime(requestDateTime);
        if (requestDate <= DateOnly.FromDateTime(now))
        {
            throw HttpResponseException.BadRequest("Cannot book an appointment in the past");
        }

        var requestTime = TimeOnly.FromDateTime(requestDateTime);
        if (requestTime < salon.OpeningTime || requestTime > salon.ClosingTime)
        {
            throw HttpResponseException.BadRequest("Cannot book an appointment outside of service hours");
        }

        var service = await serviceRepository.FindByIdAsync(request.ServiceId);
        if (service == null)
        {
            throw HttpResponseException.NotFound("Service not found");
        }

        if (requestTime.AddMinutes(service.DurationMinutes) > salon.ClosingTime)
        {
            throw new Exception("Cannot book an appointment that ends after closing time");
        }

        var customer = await customerRepository.FindByIdAsync(userId.ToString());
        if (customer == null)
        {
            throw HttpResponseException.NotFound("Customer not found");
        }

        var stylist = await stylistRepository.FindByIdAsync(request.StylistId.ToString());
        if (stylist == null)
        {
            throw HttpResponseException.NotFound("Stylist not found");
        }

        var appointment = mapper.Map<Appointment>(request);
        appointment.Customer = customer;
        appointment.Stylist = stylist;
        appointment.Service = service;
        appointment.TotalPrice = service.Price;
        await appointmentRepository.AddAsync(appointment);

        if (stylist.Email != null)
        {
            await emailService.SendEmailAsync(
                stylist.Email,
                "New Appointment",
                $"You have a new appointment with {customer.FirstName} {customer.LastName} on {requestDateTime}"
            );
        }

        return mapper.Map<AppointmentResponse>(appointment);
    }

    public async Task<AppointmentResponse?> UpdateAppointmentStatusAsync(
        Guid appointmentId,
        UpdateAppointmentStatusRequest request)
    {
        var appointment = await appointmentRepository.FindByIdWithRelatedEntitiesAsync(appointmentId);
        if (appointment == null)
        {
            return null;
        }

        if (IsUnmodifiableStatus(appointment.Status))
        {
            throw HttpResponseException.BadRequest(
                "Cannot update status of completed, cancelled, or no-show appointments");
        }

        appointment.Status = request.Status;
        if (request.Notes != null)
        {
            appointment.StylistNotes = request.Notes;
        }

        await appointmentRepository.UpdateAsync(appointment);

        if (appointment.Customer.Email != null)
        {
            await emailService.SendEmailAsync(
                appointment.Customer.Email,
                "Appointment Status Update",
                $"Your appointment with {appointment.Stylist.FirstName} {appointment.Stylist.LastName} has been updated to {appointment.Status}"
            );
        }

        return mapper.Map<AppointmentResponse>(appointment);
    }

    public async Task<AppointmentResponse?> CancelAppointmentForCustomerAsync(
        Guid appointmentId,
        CancelAppointmentRequest request)
    {
        var appointment = await appointmentRepository.FindByIdWithRelatedEntitiesAsync(appointmentId);
        if (appointment == null)
        {
            return null;
        }

        if (IsUnmodifiableStatus(appointment.Status))
        {
            throw HttpResponseException.BadRequest(
                "Cannot cancel completed, cancelled, or no-show appointments");
        }

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CustomerNotes = request.Reason;
        await appointmentRepository.UpdateAsync(appointment);

        if (appointment.Customer.Email != null)
        {
            await emailService.SendEmailAsync(
                appointment.Customer.Email,
                "Appointment Cancelled",
                $"Your appointment with {appointment.Stylist.FirstName} {appointment.Stylist.LastName} has been cancelled"
            );
        }

        return mapper.Map<AppointmentResponse>(appointment);
    }
}