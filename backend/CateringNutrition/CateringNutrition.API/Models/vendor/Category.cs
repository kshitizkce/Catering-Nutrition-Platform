using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models.vendor
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; }

        [StringLength(255)]
        public string? Description { get; set; }

        public ICollection<MenuItems> MenuItems { get; set; }


        public bool IsActive { get; set; } = true;
    }
}