using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Mvc.WebApp.Controllers
{
    public class ProductsController : Controller
    {
        private readonly HowDataContext _context;

        public ProductsController(HowDataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(_context.Products.ToList());
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

            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();

            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            return View(await _context.Products.FindAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Product updatedProduct)
        {
            if (!ModelState.IsValid)
                return View();

            var productToEdit = _context.Products.Find(updatedProduct.Id);

            if (productToEdit == null)
                return View();

            _context.Entry(productToEdit).CurrentValues.SetValues(updatedProduct);
            await _context.SaveChangesAsync();

            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var productToDelete = await _context.Products.FindAsync(id);

            if (productToDelete == null)
                return View();

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();

            return RedirectToAction("Index");
        }
    }
}