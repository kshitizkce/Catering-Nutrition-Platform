using CateringNutrition.API.Dtos;

namespace CateringNutrition.API.Interfaces
{
    public interface IAuthService
    {
        Task<object> LoginAsync(LoginDto dto);
        Task<string> RegisterAsync(RegisterDto dto, String roleType);
    }
}
