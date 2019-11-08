using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class EditModel : PageModel
    {
        private readonly HowDataContext _context;

        public EditModel(HowDataContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Product Product { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
                return NotFound();

            Product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);

            if (Product == null)
                return NotFound();

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
                return Page();

            var productToEdit = _context.Products.Find(Product.Id);

            if (productToEdit == null)
                return Page();

            _context.Entry(productToEdit).CurrentValues.SetValues(Product);
            await _context.SaveChangesAsync();

            return RedirectToPage("Index");
        }
    }
}
