using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class CreateModel : PageModel
    {
        private readonly IProductService _productSvc;

        public CreateModel(IProductService productService)
        {
            _productSvc = productService;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public Product Product { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            await _productSvc.CreateProductAsync(Product);

            return RedirectToPage("./Index");
        }
    }
}
