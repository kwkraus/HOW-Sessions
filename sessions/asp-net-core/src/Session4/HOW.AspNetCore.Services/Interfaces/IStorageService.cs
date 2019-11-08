using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Interfaces
{
    public interface IStorageService
    {
        Task SaveFileAsync(string filePath);
    }
}