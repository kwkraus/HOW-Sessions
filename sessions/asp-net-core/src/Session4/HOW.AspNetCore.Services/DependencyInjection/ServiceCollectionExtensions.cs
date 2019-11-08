using HOW.AspNetCore.Services.Implementation;
using HOW.AspNetCore.Services.Interfaces;
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
            services.AddTransient<IStorageService, AzureStorageService>();
        }

    }
}
