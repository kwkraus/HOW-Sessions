using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class DeleteModel : PageModel
    {
        private readonly IProductService _productSvc;

        public DeleteModel(IProductService productService)
        {
            _productSvc = productService;
        }

        [BindProperty]
        public Product Product { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
                return NotFound();

            Product = await _productSvc.GetProductAsync(id.GetValueOrDefault());

            if (Product == null)
                return NotFound();

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
                return NotFound();

            Product = await _productSvc.GetProductAsync(id.GetValueOrDefault());

            if (Product != null)
                await _productSvc.DeleteProductAsync(id);

            return RedirectToPage("./Index");
        }
    }
}
