using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Domains
{
    public class ProductService : IProductService
    {
        private readonly HowDataContext _context;

        public ProductService(HowDataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product> GetProductAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task UpdateProductAsync(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            var productToEdit = await _context.Products.FindAsync(product.Id);

            if (productToEdit == null)
                throw new ArgumentException($"Product Id={product.Id} was not found");

            _context.Entry(productToEdit).CurrentValues.SetValues(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(int? id)
        {
            if (id == null)
                throw new ArgumentNullException(nameof(id));

            var productToDelete = await _context.Products.FindAsync(id);

            if (productToDelete == null)
                throw new ArgumentException($"Product Id={id} was not found");

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            var newProduct = _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return newProduct.Entity;
        }
    }
}
