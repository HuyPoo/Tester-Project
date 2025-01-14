using Microsoft.EntityFrameworkCore;
using Persistence.Entities;
using Persistence.Interfaces;

namespace Persistence.Repositories;

public class SalonRepository(AppDbContext dbContext) : RepositoryBase<Salon, int>(dbContext), ISalonRepository
{
    public async Task<Salon> GetSalonAsync()
    {
        return await DbSet.FirstAsync();
    }

    public new Task AddAsync(Salon entity)
        => Task.FromException(new NotSupportedException());

    public new Task DeleteAsync(Salon entity)
        => Task.FromException(new NotSupportedException());
}