using CateringNutrition.API.Models.authorization;
using CateringNutrition.API.Models.vendor;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringNutrition.API.Models.cateringEvent
{
    public class CateringEvents
    {
        [Key]
        public int EventId { get; set; }

        [Required]
        [MaxLength(100)]
        public string EventType { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int NumberOfGuests { get; set; }

        [Required]
        public TimeSpan EventStartTime { get; set; }

        [Required]
        public TimeSpan EventEndTime { get; set; }

        [Required]
        [MaxLength(255)]
        public string EventLocation { get; set; }

        [MaxLength(100)]
        public string? BudgetRange { get; set; }

        public string? AdditionalNote { get; set; }

        [MaxLength(500)]
        public string? CateringDetailFile { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string EventStatus { get; set; } = "Pending";

        // 🔗 Navigation Properties
        [ForeignKey("VendorId")]
        public Vendors Vendor { get; set; }

        [ForeignKey("UserId")]
        public Users User { get; set; }

    }
}
