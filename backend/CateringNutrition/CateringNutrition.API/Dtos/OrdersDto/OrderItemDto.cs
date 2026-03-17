namespace CateringNutrition.API.Dtos.OrderItemDto
{

    public class OrderItemDto
    {
        public int OrderItemId { get; set; }
        public int MenuItemId { get; set; }
        public string ItemName { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int Calories { get; set; }
        public double Rating { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class OrderWithItemsDto
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; }
        public string DeliveryAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public decimal VendorRating { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class ServiceResult<T>
    {
        public bool Error { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public T Data { get; set; }
    }

}
