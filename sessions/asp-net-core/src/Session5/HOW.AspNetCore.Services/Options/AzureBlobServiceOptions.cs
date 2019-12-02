namespace HOW.AspNetCore.Services.Options
{
    public class AzureBlobServiceOptions
    {
        public string ConnectionString { get; set; }
        public string TargetContainer { get; set; } = "Products";
    }
}
