namespace CateringNutrition.API.Dtos.adminProfile
{
    public class AdminProfileUpdateDto
    {
        public int UserId { get; set; }

        public string? OwnerName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }
}
