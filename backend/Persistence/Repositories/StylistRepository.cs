using Microsoft.EntityFrameworkCore;
using Persistence.Entities;
using Persistence.Interfaces;
using Persistence.Models;

namespace Persistence.Repositories;

public class StylistRepository(AppDbContext context) : IStylistRepository
{
    public async Task<IEnumerable<User>> FindAllAsync(int page, int pageSize)
    {
        var stylists = await (
                from user in context.Users
                join userRole in context.UserRoles on user.Id equals userRole.UserId
                join role in context.Roles on userRole.RoleId equals role.Id
                where role.Name == Roles.Stylist || role.Name == Roles.Manager
                select user
            )
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return stylists;
    }

    public Task<User?> FindByIdAsync(string id)
        => (
            from user in context.Users
            join userRole in context.UserRoles on user.Id equals userRole.UserId
            join role in context.Roles on userRole.RoleId equals role.Id
            where user.Id == id && (role.Name == Roles.Stylist || role.Name == Roles.Manager)
            select user
        ).FirstOrDefaultAsync();

    public Task AddAsync(User entity)
        => Task.FromException(new NotSupportedException());

    public async Task UpdateAsync(User entity)
    {
        context.Users.Update(entity);
        await context.SaveChangesAsync();
    }

    public Task DeleteAsync(User entity)
        => Task.FromException(new NotSupportedException());

    public async Task<IEnumerable<Service>> GetStylistServicesAsync(Guid stylistId, int page, int pageSize)
    {
        var services = await context.Users
            .Where(u => u.Id == stylistId.ToString())
            .SelectMany(u => u.Services)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return services;
    }

    public async Task<IEnumerable<Appointment>> GetStylistAppointmentsAsync(Guid stylistId, int page, int pageSize)
    {
        var appointments = await context.Appointments
            .Where(a => a.StylistId == stylistId.ToString())
            .OrderBy(a => a.DateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return appointments;
    }

    public async Task<IEnumerable<Appointment>> GetStylistUpcomingAppointmentsAsync(
        Guid stylistId,
        int page,
        int pageSize)
    {
        var now = DateTime.UtcNow;
        var appointments = await context.Appointments
            .Where(a => a.StylistId == stylistId.ToString() && a.DateTime > now)
            .OrderBy(a => a.DateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return appointments;
    }

    public async Task<IEnumerable<Tuple<DateTime, bool>>> GetServiceSlotsAsync(
        Guid stylistId,
        Guid serviceId,
        DateOnly date)
    {
        var stylist = await context.Users
            .Include(u => u.Services)
            .FirstOrDefaultAsync(u => u.Id == stylistId.ToString());

        if (stylist == null)
        {
            throw new Exception("Stylist not found");
        }

        var service = stylist.Services.FirstOrDefault(s => s.Id == serviceId);
        if (service == null)
        {
            throw new Exception("Service not found");
        }

        var salon = await context.Salons.FirstAsync();

        var appointments = await context.Appointments
            .Where(a => a.StylistId == stylistId.ToString() &&
                        a.DateTime.Date == date.ToDateTime(TimeOnly.MinValue).Date)
            .ToListAsync();

        var slots = new List<Tuple<DateTime, bool>>();
        var startTime = date.ToDateTime(salon.OpeningTime);
        var endTime = date.ToDateTime(salon.ClosingTime);
        var duration = TimeSpan.FromMinutes(service.DurationMinutes);

        for (var time = startTime; time < endTime; time = time.Add(duration))
        {
            var isAvailable = !appointments.Any(a
                => a.DateTime <= time && a.DateTime.AddMinutes(service.DurationMinutes) > time);

            slots.Add(new Tuple<DateTime, bool>(time, isAvailable));
        }

        return slots;
    }
}