using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringNutrition.API.Models.vendor
{
    public class MenuItems
    {
        [Key]
        public int MenuItemId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public Category Category;
        [Required]
        [StringLength(150)]
        public string ItemName { get; set; }

        [StringLength(500)]
        public string? ItemDescription { get; set; }

        [Range(0, 5)]
        public decimal? Rating { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int? Calories { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}