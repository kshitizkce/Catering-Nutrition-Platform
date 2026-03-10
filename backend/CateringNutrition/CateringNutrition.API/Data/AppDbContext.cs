using CateringNutrition.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<SubscriptionTypes> SubscriptionTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users -> Roles
            modelBuilder.Entity<Users>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Users -> SubscriptionTypes
            modelBuilder.Entity<Users>()
                .HasOne(u => u.SubscriptionType)
                .WithMany(s => s.Users) // <-- map the collection in SubscriptionTypes
                .HasForeignKey(u => u.SubscriptionTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}