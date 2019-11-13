using HOW.AspNetCore.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HOW.AspNetCore.Data.Contexts
{
    public class HowDataContext : DbContext
    {
        public HowDataContext(DbContextOptions<HowDataContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductCategory>()
            .HasKey(t => new { t.ProductId, t.CategoryId});

            modelBuilder.Entity<ProductCategory>()
                .HasOne(pt => pt.Product)
                .WithMany(p => p.ProductCategories)
                .HasForeignKey(pt => pt.ProductId);

            modelBuilder.Entity<ProductCategory>()
                .HasOne(pt => pt.Category)
                .WithMany(t => t.ProductCategories)
                .HasForeignKey(pt => pt.CategoryId);
        }
    }
}
