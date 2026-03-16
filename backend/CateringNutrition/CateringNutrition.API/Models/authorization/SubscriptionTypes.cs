using CateringNutrition.API.Models.vendor;
using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models.authorization
{
    public class SubscriptionTypes
    {
        [Key]
        public int SubscriptionTypeId { get; set; }
        public string SubscriptionName { get; set; }

        public ICollection<Users> Users { get; set; } = new List<Users>();

        public ICollection<Subscribers> Subscribers { get; set; } = new List<Subscribers>();

    }
}
