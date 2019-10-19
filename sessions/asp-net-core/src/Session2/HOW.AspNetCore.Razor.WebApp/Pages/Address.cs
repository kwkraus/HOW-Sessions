using System.ComponentModel.DataAnnotations;

namespace HOW.AspNetCore.Razor.WebApp.Pages
{
    public class Address
    {
        [Required]
        [StringLength(75)]
        public string Street1 { get; set; }
        [StringLength(20)]
        public string Street2 { get; set; }
        [RegularExpression(@"^\d{5}(?:[-\s]\d{4})?$", ErrorMessage = "Zipcode must be between 00000 and 99999")]
        public string ZipCode { get; set; }
        [StringLength(50)]
        public string State { get; set; }
        [StringLength(50)]
        public string City { get; set; }
    }
}