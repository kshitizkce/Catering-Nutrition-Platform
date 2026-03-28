using CateringNutrition.API.Models.authorization;

namespace CateringNutrition.API.Dtos.adminVendors
{
    public class AdminOrderDto
    {
        public int OrderId { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string  OrderStatus { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<AdminOrderItemDto> Items { get; set; }
        public String Fullname { get; internal set; }
        public String Email { get; internal set; }
        public String Phone { get; internal set; }


    }

}
