using System;
using System.IO;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Interfaces
{
    public interface IStorageService
    {
        Task<byte[]> GetFileAsByteArrayAsync(string fileName);
        Task<Stream> GetFileAsStreamAsync(string fileName);
        Task RemoveFileAsync(string blobUrl);
        Task<Uri> SaveFileAsync(byte[] fileContents, string fileName);
        Task<Uri> SaveFileAsync(Stream fileStream, string fileName);
    }
}