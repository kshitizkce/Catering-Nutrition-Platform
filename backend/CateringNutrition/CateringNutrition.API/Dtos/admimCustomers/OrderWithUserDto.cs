using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Models.authorization;
using CateringNutrition.API.Models.vendor;

namespace CateringNutrition.API.Dtos.admimCustomers
{
    public class OrderWithUserDto
    {
        public int OrderId { get; set; }
        public string OrderStatus { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Customer Info
        public int CustomerUserId { get; set; }
        public string CustomerFullName { get; set; }
        public string CustomerEmail { get; set; }

        // Vendor Info
        public int VendorId { get; set; }
        public Users Customer { get; set; }
        public Vendors Vendor { get; set; }

        // Order Items
        public List<AdminOrderItemDto> Items { get; set; } = new List<AdminOrderItemDto>();
    }
}
