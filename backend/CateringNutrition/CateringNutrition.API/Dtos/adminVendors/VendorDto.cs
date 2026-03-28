namespace CateringNutrition.API.Dtos.adminVendors
{
    public class VendorDto
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string VendorEmail { get; set; }
        public string VendorPhone { get; set; }
        public string City { get; set; }
        public string Status { get; set; }

        // 🔥 NEW FIELDS
        public string VendorAddress { get; set; }
        public decimal? Rating { get; set; }
        public string BusinessHours { get; set; }
        public string BusinessLogo { get; set; }
        public string BusinessFile { get; set; }
    }
}
