using CateringNutrition.API.Models.authorization;
using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models.vendor
{
    public class Orders
    {
        [Key]
        public int OrderId { get; set; }
        public int CustomerUserId { get; set; }
        public int VendorId { get; set; }
        public int OrderStatusId { get; set; }
        public DateTime OrderDate { get; set; }
        public string DeliveryAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Users Customer { get; set; }
        public Users Vendor { get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }
    }
}
