using CateringNutrition.API.Dtos.authorization;

namespace CateringNutrition.API.Interfaces.authorization
{
    public interface IAuthService
    {
        Task<object> LoginAsync(LoginDto dto);
        Task<object> RegisterAsync(RegisterDto dto, String roleType);
        Task<string> ForgotPasswordAsync(string email);

        Task<string> ResetPasswordAsync(ResetPasswordDto dto);
        Task<string> SendEmailOtpAsync(string email);
        Task<bool> VerifyEmailOtpAsync(string email, string otp);


    }
}
