using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Dtos.vendorDto;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.EntityFrameworkCore;
using VendorDto = CateringNutrition.API.Dtos.adminVendors.VendorDto;

namespace CateringNutrition.API.Services.adminvendorservice
{
    public class AdminVendorService : IAdminVendorService
    {
        private readonly AppDbContext _context;

        public AdminVendorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminVendorDetailsDto> GetVendorDetailsAsync(int vendorId, int pageNumber, int pageSize)
        {
            // 1️⃣ Vendor Info
            var vendor = await _context.Vendors
                .Where(v => v.VendorId == vendorId)
                .Select(v => new VendorDto
                {
                    VendorId = v.VendorId,
                    VendorName = v.VendorName,
                    VendorEmail = v.VendorEmail,
                    VendorPhone = v.VendorPhone,
                    City = v.City,
                    Status = v.Status
                })
                .FirstOrDefaultAsync();

            if (vendor == null)
                return null;

            // 2️⃣ Base Orders Query
            var ordersQuery = _context.Orders
                .Where(o => o.VendorId == vendorId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem);  // ✅ Ensure MenuItem is loaded

            // Total Orders
            var totalOrders = await ordersQuery.CountAsync();

            // Total Revenue
            var totalRevenue = await ordersQuery.SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            // 3️⃣ Paginated Orders
            var orders = await ordersQuery
                .OrderByDescending(o => o.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new AdminOrderDto
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Items = o.OrderItems
                        .Select(oi => new AdminOrderItemDto
                        {
                            MenuItemId = oi.MenuItemId,
                            ItemName = oi.MenuItem != null ? oi.MenuItem.ItemName : "Unknown Item",
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        })
                        .ToList()
                })
                .ToListAsync();

            // 4️⃣ Top Selling Menu Item
            var topItem = await _context.OrderItems
                .Include(oi => oi.MenuItem)
                .Include(oi => oi.Order)
                .Where(oi => oi.Order != null && oi.Order.VendorId == vendorId)
                .Where(oi => oi.MenuItem != null)
                .GroupBy(oi => new { oi.MenuItemId, oi.MenuItem.ItemName })
                .Select(g => new TopMenuItemDto
                {
                    MenuItemId = g.Key.MenuItemId,
                    ItemName = g.Key.ItemName,
                    TotalQuantitySold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalQuantitySold)
                .FirstOrDefaultAsync();

            // 5️⃣ Return Result
            return new AdminVendorDetailsDto
            {
                Vendor = vendor,
                Orders = new PagedResultDto<AdminOrderDto>
                {
                    Data = orders,
                    TotalCount = totalOrders,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                },
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TopSellingItem = topItem
            };
        }
    }
}