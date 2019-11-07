using HOW.AspNetCore.Data.Contexts;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace HOW.AspNetCore.Mvc.WebApp.Controllers
{
    public class ProductsController : Controller
    {
        private readonly HowDataContext _context;

        public ProductsController(HowDataContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View(_context.Products.ToList());
        }
    }
}