using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringNutrition.API.Models
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Email { get; set; }

        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; }

        // Role relationship
        public int RoleId { get; set; }
        public Roles Role { get; set; }

        // SubscriptionType relationship
        [ForeignKey("SubscriptionType")] // explicitly map the FK
        public int SubscriptionTypeId { get; set; }

        public SubscriptionTypes SubscriptionType { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}