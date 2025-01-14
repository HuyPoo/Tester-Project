namespace Persistence.Interfaces;

public interface IRepository<TEntity, in TId> where TEntity : class
{
    Task<IEnumerable<TEntity>> FindAllAsync(int page, int pageSize);

    Task<TEntity?> FindByIdAsync(TId id);
    Task AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
}