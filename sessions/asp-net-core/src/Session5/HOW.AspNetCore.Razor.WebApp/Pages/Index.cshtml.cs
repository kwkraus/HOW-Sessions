using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.IO;

namespace HOW.AspNet.WebApp.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            if (HttpContext.Request.Query.ContainsKey("throw"))
            {
                _logger.LogCritical("We're about to throw an exception... get ready for it...");
                throw new FileNotFoundException("File not found exception thrown in index.chtml");
            }
        }
    }
}
