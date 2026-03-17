using CateringNutrition.API.Models.authorization;
using CateringNutrition.API.Models.vendor;
using EllipticCurve.Utils;
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

        public DbSet<Vendors> Vendors { get; set; }

        public DbSet<MenuItems> MenuItems { get; set; }

        public DbSet<Category> Category { get; set; } 

        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> OrderItems { get; set; }
        public DbSet<Subscribers> Subscribers { get; set; }

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

            // Orders -> Customer
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Customer)
                .WithMany(u => u.CustomerOrders)
                .HasForeignKey(o => o.CustomerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Orders -> Vendor
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Vendor)
                .WithMany(u => u.VendorOrders)
                .HasForeignKey(o => o.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            // OrderItems -> Orders
            modelBuilder.Entity<OrderItems>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<MenuItems>()
        .HasOne(m => m.Category)
        .WithMany(c => c.MenuItems)
        .HasForeignKey(m => m.CategoryId);
        }

    }
}