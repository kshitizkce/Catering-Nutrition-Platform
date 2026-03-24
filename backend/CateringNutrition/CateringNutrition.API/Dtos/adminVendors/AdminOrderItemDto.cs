namespace CateringNutrition.API.Dtos.adminVendors
{
    public class AdminOrderItemDto
    {
        public int MenuItemId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
