using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class IndexModel : PageModel
    {
        private readonly IProductService _productSvc;

        public IndexModel(IProductService productService)
        {
            _productSvc = productService;
        }

        public IEnumerable<Product> Products { get;set; }

        public async Task OnGetAsync()
        {
            Products = await _productSvc.GetAllProductsAsync();
        }
    }
}
