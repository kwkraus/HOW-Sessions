using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Mvc.WebApp.Controllers
{
    public class ProductsController : Controller
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productSvc)
        {
            _productService = productSvc;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return View(await _productService.GetAllProductsAsync());
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product newProduct)
        {
            if (!ModelState.IsValid)
                return View();

            await _productService.CreateProductAsync(newProduct);

            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            var product = await _productService.GetProductAsync(id.Value);

            if (product == null)
                return NotFound();

            return View(product);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            return View(await _productService.GetProductAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Product updatedProduct)
        {
            if (!ModelState.IsValid)
                return View();

            await _productService.UpdateProductAsync(updatedProduct);

            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var productToDelete = await _productService.GetProductAsync(id.Value);

            if (productToDelete == null)
            {
                return NotFound();
            }

            return View(productToDelete);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _productService.DeleteProductAsync(id);

            return RedirectToAction("Index");
        }
    }
}