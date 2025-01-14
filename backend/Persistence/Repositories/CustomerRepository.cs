using Microsoft.EntityFrameworkCore;
using Persistence.Entities;
using Persistence.Interfaces;
using Persistence.Models;

namespace Persistence.Repositories;

public class CustomerRepository(AppDbContext context) : ICustomerRepository
{
    public async Task<IEnumerable<User>> FindAllAsync(int page, int pageSize)
    {
        var customers = await (
                from user in context.Users
                join userRole in context.UserRoles on user.Id equals userRole.UserId
                join role in context.Roles on userRole.RoleId equals role.Id
                where role.Name == Roles.Customer
                select user
            )
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return customers;
    }

    public Task<User?> FindByIdAsync(string id) => (
        from user in context.Users
        join userRole in context.UserRoles on user.Id equals userRole.UserId
        join role in context.Roles on userRole.RoleId equals role.Id
        where role.Name == Roles.Customer && user.Id == id
        select user
    ).FirstOrDefaultAsync();

    public async Task UpdateAsync(User entity)
    {
        context.Users.Update(entity);
        await context.SaveChangesAsync();
    }

    public Task AddAsync(User entity)
        => Task.FromException(new NotSupportedException());

    public Task DeleteAsync(User entity)
        => Task.FromException(new NotSupportedException());

    public async Task<IEnumerable<Appointment>> FindAllAppointmentsAsync(Guid customerId, int page, int pageSize)
    {
        var appointments = await context.Appointments
            .Where(a => a.CustomerId == customerId.ToString())
            .OrderBy(a => a.DateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return appointments;
    }

    public async Task<IEnumerable<Appointment>> FindUpcomingAppointmentsAsync(Guid customerId, int page, int pageSize)
    {
        var now = DateTime.UtcNow;
        var appointments = await context.Appointments
            .Where(a => a.CustomerId == customerId.ToString() && a.DateTime > now)
            .OrderBy(a => a.DateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return appointments;
    }
}