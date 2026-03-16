using EllipticCurve.Utils;
using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models.vendor
{
    public class OrderItems
    {
        [Key]
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal => Quantity * UnitPrice;
        public DateTime CreatedAt { get; set; }

        public Orders Order { get; set; }
        public MenuItems MenuItem { get; set; } // if menu exists

    }
}
