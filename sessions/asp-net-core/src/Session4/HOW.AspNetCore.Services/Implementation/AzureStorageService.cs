using HOW.AspNetCore.Services.Interfaces;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Implementation
{
    public class AzureStorageService : IStorageService
    {
        public async Task SaveFileAsync(string filePath)
        {
            //await _azureSDK.SaveFileAsync();
        }
    }
}
