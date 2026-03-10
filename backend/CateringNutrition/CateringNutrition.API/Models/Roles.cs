using System.ComponentModel.DataAnnotations;

namespace CateringNutrition.API.Models
{
    public class Roles
    {
        [Key]
        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public ICollection<Users> Users { get; set; } = new List<Users>();
    }
}
