using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Data.Entities;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class DetailsModel : PageModel
    {
        private readonly HOW.AspNetCore.Data.Contexts.HowDataContext _context;

        public DetailsModel(HOW.AspNetCore.Data.Contexts.HowDataContext context)
        {
            _context = context;
        }

        public Product Product { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);

            if (Product == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
