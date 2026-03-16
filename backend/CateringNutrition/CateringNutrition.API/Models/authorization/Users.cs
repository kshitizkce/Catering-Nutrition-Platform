using CateringNutrition.API.Models.vendor;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace CateringNutrition.API.Models.authorization
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

        public string? ResetToken { get; set; }//password

        public DateTime? ResetTokenExpiry { get; set; }//password reset

        public ICollection<Subscribers> Subscribers { get; set; }

        // Orders
        public ICollection<Orders> CustomerOrders { get; set; }

    public ICollection<Orders> VendorOrders { get; set; }
        

    }
}