using HOW.AspNetCore.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HOW.AspNetCore.Data.Contexts
{
    public class HowDataContext : DbContext
    {
        public HowDataContext(DbContextOptions<HowDataContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
    }
}
