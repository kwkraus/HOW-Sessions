using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using HOW.AspNetCore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class CreateModel : PageModel
    {
        private readonly HowDataContext _context;
        private readonly IStorageService _storageService;

        public CreateModel(HowDataContext context, IStorageService storageSvc)
        {
            _context = context;
            _storageService = storageSvc;
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

            var fileLoc = await _storageService.SaveFileAsync("");

            _context.Products.Add(Product);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
