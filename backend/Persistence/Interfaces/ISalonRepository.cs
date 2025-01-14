using Persistence.Entities;

namespace Persistence.Interfaces;

public interface ISalonRepository : IRepository<Salon, int>
{
    Task<Salon> GetSalonAsync();
}