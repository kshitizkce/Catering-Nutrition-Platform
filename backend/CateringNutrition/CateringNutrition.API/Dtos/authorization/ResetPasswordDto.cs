namespace CateringNutrition.API.Dtos.authorization
{
    public class ResetPasswordDto
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
