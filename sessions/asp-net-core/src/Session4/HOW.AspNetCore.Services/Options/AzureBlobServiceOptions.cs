namespace HOW.AspNetCore.Services
{
    public class AzureBlobServiceOptions
    {
        public string ConnectionString { get; set; }
        public string TargetContainer { get; set; }
    }
}
