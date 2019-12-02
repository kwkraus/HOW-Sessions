namespace HOW.AspNetCore.Services.Options
{
    public class AzureQueueServiceOptions
    {
        public string ConnectionString { get; set; }
        public string ProcessingQueue { get; set; }
    }
}
