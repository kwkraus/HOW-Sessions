using HOW.AspNetCore.Razor.WebApp.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;

namespace HOW.AspNetCore.Razor.WebApp.Pages.Products
{
    public class IndexModel : PageModel
    {
        [BindProperty]
        public List<Product> Products { get; set; }

        public void OnGet()
        {
            List<Product> products = new List<Product>
            {
                new Product
                {
                    Name = "Gummy Bears",
                    Price = 5.99M
                },
                new Product
                {
                    Name = "Sweeie Bears",
                    Price = 3.99M
                },
                new Product
                {
                    Name = "Sour Bears",
                    Price = 7.99M
                }
            };

            Products = products;
        }
    }
}