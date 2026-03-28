namespace CateringNutrition.API.Dtos.vendorDto
{
    public class VendorProfileDto
    {

        public int UserId { get; set; }

        public string OwnerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Password { get; set; }

        // VENDOR TABLE
        public int MealCateringStatus { get; set; }
        public string BusinessName { get; set; }
        public string? BusinessDescription { get; set; }
        public string? VendorAddress { get; set; }
        public string? City { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public string? BusinessHours { get; set; }
        public string? BusinessLogo { get; set; }
        public string? BusinessFile { get; set; }
    }
}
