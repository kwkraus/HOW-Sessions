using HOW.AspNetCore.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Implementation
{
    public class AWSStorageService : IStorageService
    {
        public Task SaveFileAsync(string filePath)
        {
            throw new NotImplementedException();
        }
    }
}
