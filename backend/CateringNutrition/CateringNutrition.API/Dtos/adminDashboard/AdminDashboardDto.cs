namespace CateringNutrition.API.Dtos.adminDashboard
{
    public class AdminDashboardDto
    {
        public int VendorsCount { get; set; }
        public int CustomersCount { get; set; }
        public int OrdersCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<RevenueByDayDto> RevenueByDay { get; set; }
    }

    // Dtos/RevenueByDayDto.cs
    public class RevenueByDayDto
    {
        public string Day { get; set; } // e.g., "Mon", "Tue"
        public decimal Revenue { get; set; }
    }
}