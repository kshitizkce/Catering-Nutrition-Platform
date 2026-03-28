using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.admimCustomers;
using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Dtos.OrderItemDto;
using CateringNutrition.API.Dtos.vendorDto;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.AdminCustomersService
{
    public class AdminCustomersUsersSrvice : IAdminCustomerUsersService
    {
    
        private readonly AppDbContext _context;

        public AdminCustomersUsersSrvice(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.SubscriptionType)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    SubscriptionName = u.SubscriptionType.SubscriptionName,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AdminCustomerUserDetailsDto> GetCustomerDetailsAsync(int userId, int pageNumber, int pageSize)
        {
            // 1️⃣ User Info
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    SubscriptionName = u.SubscriptionType.SubscriptionName,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            // 2️⃣ Base Orders Query for this customer
            var ordersQuery = _context.Orders
                .Where(o => o.CustomerUserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem);

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

            // 4️⃣ Top Ordered Menu Item for this customer
            var topItem = await _context.OrderItems
                .Include(oi => oi.MenuItem)
                .Include(oi => oi.Order)
                .Where(oi => oi.Order != null && oi.Order.CustomerUserId == userId)
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
            return new AdminCustomerUserDetailsDto
            {
                User = user,
                Orders = new PagedResultDto<AdminOrderDto>
                {
                    Data = orders,
                    TotalCount = totalOrders,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                },
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TopOrderedItem = topItem
            };
        }


        public async Task<List<AdminOrderDto>> GetAllOrdersAsync()
        {
            var orders = await (
                from o in _context.Orders
                join u in _context.Users on o.CustomerUserId equals u.UserId
                join v in _context.Vendors on o.VendorId equals v.VendorId
                select new AdminOrderDto
                {
                    OrderId = o.OrderId,
                    Fullname = u.FullName,
                    Email=u.Email,
                    Phone=u.Phone,
                    VendorId = o.VendorId, 
                    VendorName = v.VendorName,
                    OrderStatus = o.OrderStatusId == 1 ? "Cancelled" :
                                  o.OrderStatusId == 2 ? "Pending" :
                                  o.OrderStatusId == 3 ? "Confirmed" :
                                  o.OrderStatusId == 4 ? "Shipped" :
                                  o.OrderStatusId == 5 ? "Delivered" : "Unknown",
                    OrderDate = DateTime.Now,
                    DeliveryAddress = o.DeliveryAddress,
                    TotalAmount = o.TotalAmount,
                    Items = o.OrderItems.Select(oi => new AdminOrderItemDto
                    {
                        MenuItemId = oi.MenuItemId,
                        ItemName = oi.MenuItem != null ? oi.MenuItem.ItemName : "Unknown Item",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList()
                }
            ).ToListAsync();

            return orders;
        }
    }
}



