using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models
{
    public class SubscriptionTypes
    {
        [Key]
        public int SubscriptionTypeId { get; set; }
        public string SubscriptionName { get; set; }

        public ICollection<Users> Users { get; set; } = new List<Users>();
    }
}
