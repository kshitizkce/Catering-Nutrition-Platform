namespace CateringNutrition.API.Dtos.vendorDto
{
    public class UpdateOrderDto
    {
        public string DeliveryAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public int OrderStatusId { get; set; }

        public List<UpdateOrderItemDto> OrderItems { get; set; }
    }
}

