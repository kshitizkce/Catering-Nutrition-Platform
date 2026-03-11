using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringNutrition.API.Models
{
    public class Vendors
    {
        [Key]
        public int VendorId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(150)]
        public string VendorName { get; set; }

        [StringLength(500)]
        public string? BusinessDescription { get; set; }

        [Phone]
        [StringLength(30)]
        public string? VendorPhone { get; set; }

        [EmailAddress]
        [StringLength(320)]
        public string? VendorEmail { get; set; }

        [StringLength(255)]
        public string? VendorAddress { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [Range(0, 5)]
        public decimal? Rating { get; set; }

        [Required]
        [RegularExpression("Active|Inactive", ErrorMessage = "Status must be Active or Inactive")]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}