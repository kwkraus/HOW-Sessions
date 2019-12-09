using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace HOW.AspNet.WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureAppConfiguration((context, config) =>
                     {
                         //if (context.HostingEnvironment.IsProduction())
                         //{
                         //    var builtConfig = config.Build();
                         //    var kvConfig = builtConfig.GetSection("AzureKeyVault");

                         //    using var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
                         //    store.Open(OpenFlags.ReadOnly);
                         //    var certs = store.Certificates
                         //        .Find(X509FindType.FindByThumbprint,
                         //            kvConfig["AzureADCertThumbprint"], false);

                         //    config.AddAzureKeyVault(
                         //        $"https://{kvConfig["VaultName"]}.vault.azure.net/",
                         //        kvConfig["AzureADApplicationId"],
                         //        certs.OfType<X509Certificate2>().Single());

                         //    store.Close();
                         //}
                     })
                    .UseStartup<Startup>();
                });
    }
}
