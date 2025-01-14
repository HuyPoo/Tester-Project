using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Persistence.Entities;

namespace Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<User>(options)
{
    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<Salon> Salons { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var tableName = entityType.GetTableName();
            if (tableName != null && tableName.StartsWith("AspNet"))
            {
                entityType.SetTableName(tableName[6..]);
            }
        }

        builder.Entity<Appointment>()
            .HasOne(a => a.Customer)
            .WithMany(u => u.CustomerAppointments)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Appointment>()
            .HasOne(a => a.Stylist)
            .WithMany(s => s.StylistAppointments)
            .HasForeignKey(a => a.StylistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Service>()
            .HasMany(s => s.Stylists)
            .WithMany(u => u.Services)
            .UsingEntity(j => j.ToTable("ServiceStylists"));
    }
}