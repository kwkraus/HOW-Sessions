using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class DeleteModel : PageModel
    {
        private readonly IProductService _productSvc;
        private readonly ILogger<DeleteModel> _logger;

        public DeleteModel(IProductService productService, ILogger<DeleteModel> logger)
        {
            _productSvc = productService;
            _logger = logger;
        }

        [BindProperty]
        public Product Product { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            var methodName = nameof(OnPostAsync);

            _logger.LogDebug($"Entering {methodName} method", id.GetValueOrDefault());

            if (id == null)
                return NotFound();

            Product = await _productSvc.GetProductAsync(id.GetValueOrDefault());

            if (Product == null)
                return NotFound();

            _logger.LogDebug($"Leaving {methodName} method", id.GetValueOrDefault());

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            var methodName = nameof(OnPostAsync);

            using (_logger.BeginScope("Delete Product Id={id} Logging Scope ", id))
            {
                _logger.LogDebug($"Entering {methodName} method");

                if (id == null)
                    return NotFound();

                await _productSvc.DeleteProductAsync(id);

                _logger.LogDebug($"Leaving {methodName} method");
            }
            return RedirectToPage("./Index");
        }
    }
}
