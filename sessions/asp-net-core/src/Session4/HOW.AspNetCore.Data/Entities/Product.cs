using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HOW.AspNetCore.Data.Entities
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(60, MinimumLength = 3)]
        [DisplayName("Product Name")]
        public string Name { get; set; }

        [Required]
        [Range(1, 1000)]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public List<ProductCategory> ProductCategories { get; set; }
    }
}
