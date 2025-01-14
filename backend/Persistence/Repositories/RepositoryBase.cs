using Microsoft.EntityFrameworkCore;
using Persistence.Interfaces;

namespace Persistence.Repositories;

public abstract class RepositoryBase<TEntity, TId>(DbContext dbContext)
    : IRepository<TEntity, TId> where TEntity : class
{
    protected readonly DbSet<TEntity> DbSet = dbContext.Set<TEntity>();

    public async Task<IEnumerable<TEntity>> FindAllAsync(int page, int pageSize)
        => await DbSet
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<TEntity?> FindByIdAsync(TId id)
        => await DbSet.FindAsync(id);

    public async Task AddAsync(TEntity entity)
    {
        await DbSet.AddAsync(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(TEntity entity)
    {
        DbSet.Update(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(TEntity entity)
    {
        DbSet.Remove(entity);
        await dbContext.SaveChangesAsync();
    }
}