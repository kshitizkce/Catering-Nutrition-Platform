using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringNutrition.API.Models.cateringEvent
{
    public class EventConfirmation
    {
        [Key]
        public int Id { get; set; }  // Primary key for the table

        [Required]
        public int EventId { get; set; }  // FK to CateringEvents table

        [ForeignKey("EventId")]
        public CateringEvents Event { get; set; }  // Navigation property

        [Required]
        public Guid Token { get; set; }  // Unique token for confirmation/cancellation

        [Required]
        public DateTime Expiry { get; set; }  // Expiry date for the confirmation link

        public bool IsConfirmed { get; set; } = false;  // True if customer confirmed
        public bool IsCancelled { get; set; } = false;  // True if customer cancelled

        public DateTime? ConfirmedAt { get; set; }  // Timestamp of confirmation
        public DateTime? CancelledAt { get; set; }  // Timestamp of cancel
    }
}
