using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class CreateModel : PageModel
    {
        private readonly HowDataContext _context;

        public CreateModel(HowDataContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Product Product { get; set; }

        public void OnGet()
        {

        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
                return Page();

            await _context.Products.AddAsync(Product);
            await _context.SaveChangesAsync();

            return RedirectToPage("Index");
        }
    }
}
