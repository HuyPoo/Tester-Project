using Microsoft.EntityFrameworkCore;
using Persistence.Entities;
using Persistence.Interfaces;

namespace Persistence.Repositories;

public class ServiceRepository(AppDbContext context) : RepositoryBase<Service, Guid>(context), IServiceRepository
{
    public new async Task<IEnumerable<Service>> FindAllAsync(int page, int pageSize)
    {
        var services = await DbSet
            .Where(s => !s.IsDeleted)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return services;
    }

    public new Task<Service?> FindByIdAsync(Guid id)
        => DbSet
            .Include(s => s.Stylists)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

    public new async Task DeleteAsync(Service entity)
    {
        entity.IsDeleted = true;
        await UpdateAsync(entity);
    }

    public async Task<IEnumerable<User>> GetServiceStylistsAsync(Guid serviceId, int page, int pageSize)
    {
        var stylists = await DbSet
            .Include(s => s.Stylists)
            .Where(s => s.Id == serviceId)
            .SelectMany(s => s.Stylists)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return stylists;
    }

    public async Task AddServiceStylistAsync(Guid serviceId, Guid stylistId)
    {
        var service = await context.Services.Include(s => s.Stylists).FirstOrDefaultAsync(s => s.Id == serviceId);
        var stylist = await context.Users.FindAsync(stylistId.ToString());
        if (service == null || stylist == null)
        {
            return;
        }

        service.Stylists.Add(stylist);
        await context.SaveChangesAsync();
    }

    public async Task RemoveServiceStylistAsync(Guid serviceId, Guid stylistId)
    {
        var service = await context.Services.Include(s => s.Stylists).FirstOrDefaultAsync(s => s.Id == serviceId);
        var stylist = await context.Users.FindAsync(stylistId.ToString());
        if (service == null || stylist == null)
        {
            return;
        }

        service.Stylists.Remove(stylist);
        await context.SaveChangesAsync();
    }
}