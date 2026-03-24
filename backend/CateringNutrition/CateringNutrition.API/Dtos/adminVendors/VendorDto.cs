namespace CateringNutrition.API.Dtos.adminVendors
{
    public class VendorDto
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string? VendorEmail { get; set; }
        public string? VendorPhone { get; set; }
        public string? City { get; set; }
        public string Status { get; set; }
    }
}
