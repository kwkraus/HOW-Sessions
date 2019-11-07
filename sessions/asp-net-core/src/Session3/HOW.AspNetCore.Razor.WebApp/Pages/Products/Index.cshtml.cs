using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Linq;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class IndexModel : PageModel
    {
        private readonly HowDataContext _context;

        public IndexModel(HowDataContext context)
        {
            _context = context;
        }

        [BindProperty]
        public List<Product> Products { get; set; }

        public void OnGet()
        {
            Products = _context.Products.ToList();
        }
    }
}