using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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

        public async Task OnGetAsync(int id)
        {
            Product = await _context.Products.FindAsync(id);
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