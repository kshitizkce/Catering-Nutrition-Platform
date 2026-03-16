namespace CateringNutrition.API.Dtos.vendorDto
{
    public class UpdateOrderItemDto
    {
        public int OrderItemId { get; set; }
        public int Quantity { get; set; }

        public int MenuItemId { get; set; }

        public decimal UnitPrice { get; set; }
    }
}
