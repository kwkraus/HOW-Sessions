using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HOW.AspNetCore.Data.Entities
{
    public class Category
    {
        [MaxLength(50)]
        public string CategoryId { get; set; }

        public List<ProductCategory> ProductCategories { get; set; }
    }
}
