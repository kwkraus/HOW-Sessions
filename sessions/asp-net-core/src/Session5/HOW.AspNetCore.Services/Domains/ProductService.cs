using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Domains
{
    public class ProductService : IProductService
    {
        private readonly HowDataContext _context;
        private readonly IStorageService _storageService;
        private readonly ILogger<ProductService> _logger;

        public ProductService(HowDataContext context, IStorageService storageSvc, ILogger<ProductService> logger)
        {
            _context = context;
            _storageService = storageSvc;
            _logger = logger;
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

            if (product.Image != null)
            {
                var imageLocation = await SaveFileToStorageAsync(product);

                productToEdit.ImageLocation = imageLocation.ToString();
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteProductAsync(int? id)
        {
            var methodName = nameof(DeleteProductAsync);

            _logger.LogDebug($"Entering {methodName}", id.GetValueOrDefault());

            if (id == null)
                throw new ArgumentNullException(nameof(id));

            var productToDelete = await _context.Products.FindAsync(id);

            if (productToDelete == null)
                throw new ArgumentException($"Product Id={id} was not found");

            try
            {
                await _storageService.RemoveFileAsync(productToDelete.ImageLocation);
            }
            catch
            {
                //Exception buried 
            }

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();

            _logger.LogDebug($"Leaving {methodName}", id.GetValueOrDefault());
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            var newProduct = await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            if (product.Image != null)
            {
                var imageLocation = await SaveFileToStorageAsync(product);

                newProduct.Entity.ImageLocation = imageLocation.ToString();
                await _context.SaveChangesAsync();
            }

            return newProduct.Entity;
        }

        private async Task<Uri> SaveFileToStorageAsync(Product product)
        {
            return await _storageService.SaveFileAsync(
                product.Image.OpenReadStream(),
                $"{product.Id}{Path.GetExtension(product.Image.FileName)}");
        }
    }
}
