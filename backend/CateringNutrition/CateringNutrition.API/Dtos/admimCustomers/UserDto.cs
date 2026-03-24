namespace CateringNutrition.API.Dtos.admimCustomers
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }

        public string RoleName { get; set; }
        public string SubscriptionName { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
