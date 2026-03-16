using CateringNutrition.API.Models.authorization;
using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models.vendor
{
    public class Subscribers
    {
        [Key]
        public int SubscriberId { get; set; }
        public int UserId { get; set; }
        public int VendorId { get; set; }
        public int SubscriptionTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Users User { get; set; }
        public SubscriptionTypes SubscriptionType { get; set; }

        public Vendors Vendor { get; set; }
    }
}
