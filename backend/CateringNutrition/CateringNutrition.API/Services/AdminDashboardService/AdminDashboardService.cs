using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.adminDashboard;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.AdminDashboardService
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly AppDbContext _context;

        public AdminDashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetDashboardDataAsync()
        {
            // 1️⃣ Calculate counts and total revenue
            var vendorsCount = await _context.Vendors.CountAsync();
            var customersCount = await _context.Users.CountAsync();
            var ordersCount = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

            // 2️⃣ Get revenue for the last 7 days
            var lastWeek = DateTime.Today.AddDays(-6); // 7 days including today

            var revenueByDay = await _context.Orders
                .Where(o => o.OrderDate >= lastWeek)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .ToListAsync();

            var revenueByDayDto = revenueByDay
                .Select(r => new RevenueByDayDto
                {
                    Day = r.Date.DayOfWeek.ToString().Substring(0, 3), // Mon, Tue...
                    Revenue = r.Revenue
                })
                .ToList();

            // 3️⃣ Ensure all 7 days are present
            var revenueByDayFull = Enumerable.Range(0, 7)
                .Select(i =>
                {
                    var date = lastWeek.AddDays(i);
                    var dayData = revenueByDayDto.FirstOrDefault(r => r.Day == date.DayOfWeek.ToString().Substring(0, 3));
                    return new RevenueByDayDto
                    {
                        Day = date.DayOfWeek.ToString().Substring(0, 3),
                        Revenue = dayData?.Revenue ?? 0
                    };
                })
                .ToList();

            // 4️⃣ Return dashboard DTO
            return new AdminDashboardDto
            {
                VendorsCount = vendorsCount,
                CustomersCount = customersCount,
                OrdersCount = ordersCount,
                TotalRevenue = totalRevenue,
                RevenueByDay = revenueByDayFull
            };
        }
    }
}