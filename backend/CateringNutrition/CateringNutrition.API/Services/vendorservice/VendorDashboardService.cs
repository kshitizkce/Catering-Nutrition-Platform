using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.OrderItemDto;
using CateringNutrition.API.Dtos.vendorDto;
using CateringNutrition.API.Interfaces.vendor;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.vendorservice
{
    public class VendorDashboardService : IVendorDashboardService
    {
        private readonly AppDbContext _context;
        private readonly VendorService _orderService;

        public VendorDashboardService(AppDbContext context, VendorService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        public async Task<VendorDashboardDto> GetDashboardAsync(int vendorId)
        {
            // Fetch vendor details safely
            var vendor = await _context.Vendors
                .AsNoTracking()
                .Where(v => v.VendorId == vendorId)
                .Select(v => new VendorDto
                {
                    BusinessName = v.VendorName,
                    Email = v.VendorEmail,
                    Phone = v.VendorPhone,
                    Address = v.VendorAddress
                })
                .FirstOrDefaultAsync();

            if (vendor == null)
                return null;

            // Fetch vendor rating safely
            var vendorRating = await _context.Vendors
                .Where(v => v.VendorId == vendorId)
                .Select(v => (int?)v.Rating)
                .FirstOrDefaultAsync() ?? 0;

            // Date ranges
            var now = DateTime.UtcNow;
            var weekAgo = now.AddDays(-7);
            var monthAgo = now.AddMonths(-1);

            // Weekly and monthly orders
            var weeklyOrders = await _context.Orders
                .Where(o => o.VendorId == vendorId && o.OrderDate >= weekAgo)
                .ToListAsync();

            var monthlyOrders = await _context.Orders
                .Where(o => o.VendorId == vendorId && o.OrderDate >= monthAgo)
                .ToListAsync();

            // Revenue calculation
            var revenue = new RevenueDto
            {
                WeeklyRevenue = weeklyOrders.Sum(o => o.TotalAmount),
                WeeklyOrders = weeklyOrders.Count,
                MonthlyRevenue = monthlyOrders.Sum(o => o.TotalAmount),
                MonthlyOrders = monthlyOrders.Count,
                AvgOrderAmount = monthlyOrders.Count > 0
                    ? monthlyOrders.Sum(o => o.TotalAmount) / monthlyOrders.Count
                    : 0
            };

            // Recent orders safely
            var ordersResult = await _orderService.GetOrdersWithItemsAsync(vendorId);
            var recentOrders = ordersResult?.Error == true
                ? new List<OrderWithItemsDto>()
                : ordersResult?.Data ?? new List<OrderWithItemsDto>();

            // Include rating in vendor DTO
            vendor.Rating = vendorRating;

            return new VendorDashboardDto
            {
                Vendor = vendor,
                Revenue = revenue,
                RecentOrders = recentOrders
            };
        }
    }
}