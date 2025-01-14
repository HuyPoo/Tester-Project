using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Persistence.Helpers;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=(localdb)\\mssqllocaldb;Database=Virgo14DB;Trusted_Connection=True;MultipleActiveResultSets=true"
        );

        return new AppDbContext(optionsBuilder.Options);
    }
}