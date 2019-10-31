using HOW.AspNetCore.Mvc.WebApp.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace HOW.AspNetCore.Mvc.WebApp.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
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

            return View(products);
        }
    }
}