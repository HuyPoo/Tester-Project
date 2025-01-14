using Microsoft.EntityFrameworkCore;
using Persistence.Entities;
using Persistence.Interfaces;
using Persistence.Models.Enumerations;

namespace Persistence.Repositories;

public class AppointmentRepository(AppDbContext context)
    : RepositoryBase<Appointment, Guid>(context), IAppointmentRepository
{
    public new async Task<IEnumerable<Appointment>> FindAllAsync(int page, int pageSize)
    {
        return await DbSet
            .OrderBy(a => a.DateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public new Task DeleteAsync(Appointment entity)
        => Task.FromException(new NotSupportedException());

    public Task<Appointment?> FindByIdWithRelatedEntitiesAsync(Guid id)
        => DbSet
            .Include(a => a.Customer)
            .Include(a => a.Stylist)
            .Include(a => a.Service)
            .FirstOrDefaultAsync(a => a.Id == id);

    public Task<int> CountAsync(Guid? stylistId, DateTime? startDate, DateTime? endDate)
    {
        var query = DbSet.AsQueryable();
        if (stylistId.HasValue)
        {
            query = query.Where(a => a.StylistId == stylistId.ToString());
        }

        if (startDate.HasValue)
        {
            query = query.Where(a => a.DateTime >= startDate);
        }

        if (endDate.HasValue)
        {
            query = query.Where(a => a.DateTime <= endDate);
        }

        return query.CountAsync();
    }

    public Task<decimal> GetTotalRevenueAsync(Guid? stylistId, DateTime? startDate, DateTime? endDate)
    {
        var query = DbSet.AsQueryable().Where(a => a.Status == AppointmentStatus.Completed);
        if (stylistId.HasValue)
        {
            query = query.Where(a => a.StylistId == stylistId.ToString());
        }

        if (startDate.HasValue)
        {
            query = query.Where(a => a.DateTime >= startDate);
        }

        if (endDate.HasValue)
        {
            query = query.Where(a => a.DateTime <= endDate);
        }

        return query.SumAsync(a => a.TotalPrice);
    }
}