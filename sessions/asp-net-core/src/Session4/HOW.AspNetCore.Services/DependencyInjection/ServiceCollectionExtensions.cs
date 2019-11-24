using HOW.AspNetCore.Services.Interfaces;
using HOW.AspNetCore.Services.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace HOW.AspNetCore.Services.DependencyInjection
{
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
