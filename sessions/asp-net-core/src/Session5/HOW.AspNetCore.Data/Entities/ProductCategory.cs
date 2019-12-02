namespace HOW.AspNetCore.Data.Entities
{
    public class ProductCategory
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public string CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
