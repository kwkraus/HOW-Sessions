using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class IndexModel : PageModel
    {
        private readonly HowDataContext _context;

        public IndexModel(HowDataContext context)
        {
            _context = context;
        }

        public IList<Product> Products { get;set; }

        public async Task OnGetAsync()
        {
            Products = await _context.Products.ToListAsync();
        }
    }
}
