using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOW.AspNetCore.Razor.WebApp.Pages
{
    public class ContactModel : PageModel
    {
        public string Phone { get; set; }
        public string Fax { get; set; }
        public Address Address { get; set; }

        public void OnGet()
        { 
        }
    }
}
