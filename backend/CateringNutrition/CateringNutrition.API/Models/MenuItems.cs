using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models
{
    public class MenuItems
    {
        [Key]
        public int MenuItemId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(150)]
        public string ItemName { get; set; }

        [StringLength(500)]
        public string? ItemDescription { get; set; }

        [Range(0, 5)]
        public decimal? Rating { get; set; }

        [Required]
        [Range(0, 999999)]
        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int? Calories { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}