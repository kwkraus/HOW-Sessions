using System.Collections.Generic;
using System.Threading.Tasks;
using HOW.AspNetCore.Data.Entities;

namespace HOW.AspNetCore.Services.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateProductAsync(Product product);
        Task DeleteProductAsync(int? id);
        Task<Product> GetProductAsync(int id);
        Task<IEnumerable<Product>> GetAllProducts();
        Task UpdateProductAsync(Product product);
    }
}