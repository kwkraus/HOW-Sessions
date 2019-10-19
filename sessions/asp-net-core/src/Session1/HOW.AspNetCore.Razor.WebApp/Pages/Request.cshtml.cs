using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOW.AspNetCore.Razor.WebApp.Pages
{
    public class RequestModel : PageModel
    {
        public string TitleEnhancer { get; set; } = "Josh is sometimes awesome";

        public void OnGet()
        {

        }
    }
}