using CateringNutrition.API.Dtos.OrderItemDto;
using CateringNutrition.API.Models.vendor;

namespace CateringNutrition.API.Dtos.vendorDto
{
    public class VendorDashboardDto
    {
        public VendorDto Vendor { get; set; }
        public RevenueDto Revenue { get; set; }
        public List<OrderWithItemsDto> RecentOrders { get; set; } = new List<OrderWithItemsDto>();

    }

    public class VendorDto
    {
        public string BusinessName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        public decimal Rating { get; set; }
    }

    public class RevenueDto
    {
        public decimal WeeklyRevenue { get; set; }
        public int WeeklyOrders { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int MonthlyOrders { get; set; }
        public decimal AvgOrderAmount { get; set; }
    }
}
