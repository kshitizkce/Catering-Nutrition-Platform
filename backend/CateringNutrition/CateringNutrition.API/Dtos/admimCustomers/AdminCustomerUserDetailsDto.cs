using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Dtos.vendorDto;

namespace CateringNutrition.API.Dtos.admimCustomers
{
    public class AdminCustomerUserDetailsDto
    {
        public UserDto User { get; set; }
        public PagedResultDto<AdminOrderDto> Orders { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public TopMenuItemDto TopOrderedItem { get; set; }
    }
}
