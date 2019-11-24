using HOW.AspNetCore.Services.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Storage
{
    public class AWSStorageService : IStorageService
    {
        public Task<byte[]> GetFileAsByteArrayAsync(string fileName)
        {
            throw new NotImplementedException();
        }

        public Task<Stream> GetFileAsStreamAsync(string fileName)
        {
            throw new NotImplementedException();
        }

        public Task RemoveFileAsync(string blobUrl)
        {
            throw new NotImplementedException();
        }

        public Task<Uri> SaveFileAsync(byte[] fileContents, string fileName)
        {
            throw new NotImplementedException();
        }

        public Task<Uri> SaveFileAsync(Stream fileStream, string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
