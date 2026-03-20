namespace CateringNutrition.API.Dtos.menuitemsDTOS
{
    public class MenuItemDto
    {

        public int VendorId { get; set; }
        public int CategoryId { get; set; }
        public string ItemName { get; set; }
        public string? ItemDescription { get; set; }
        public decimal Price { get; set; }
        public int? Calories { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string? ImageUrl { get; set; }
    }
}
