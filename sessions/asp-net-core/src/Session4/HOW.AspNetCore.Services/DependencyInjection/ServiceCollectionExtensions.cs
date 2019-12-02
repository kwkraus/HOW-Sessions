using HOW.AspNetCore.Services.Interfaces;
using HOW.AspNetCore.Services.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace HOW.AspNetCore.Services.DependencyInjection
{
    /// <summary>
    /// This is for demonstration purposes only
    /// Use this extension to demonstrate how to encapsulate different registration types
    /// for use within the Startup.cs
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        public static void AddHOWAWSStorage(this IServiceCollection services)
        {
            services.AddTransient<IStorageService, AWSStorageService>();
        }

        public static void AddHOWAzureStorage(this IServiceCollection services)
        {
            services.AddTransient<IStorageService, AzureBlobService>();
        }
    }
}
