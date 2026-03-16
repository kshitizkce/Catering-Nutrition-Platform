using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.vendorDto;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.vendorservice
{
    public class VendorService
    {
        private readonly AppDbContext _context;

        public VendorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetOrdersAsync(int vendorId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.VendorId == vendorId)
                    .Include(o => o.OrderItems)
                    .ToListAsync();

                return orders;
            }
            catch (Exception ex)
            {
                return new { Error = true, Message = "Failed to fetch orders.", Detail = ex.Message };
            }
        }

        public async Task<object> UpdateOrderAsync(int vendorId, int orderId, UpdateOrderDto updatedOrder)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId && o.VendorId == vendorId);

                if (order == null)
                    return new { Error = true, Message = "Order not found for this vendor." };

                order.DeliveryAddress = updatedOrder.DeliveryAddress;
                order.TotalAmount = updatedOrder.TotalAmount;
                order.OrderStatusId = updatedOrder.OrderStatusId;
                order.UpdatedAt = DateTime.UtcNow;

                foreach (var updatedItem in updatedOrder.OrderItems)
                {
                    var item = order.OrderItems.FirstOrDefault(i => i.OrderItemId == updatedItem.OrderItemId);
                    if (item != null)
                    {
                        item.Quantity = updatedItem.Quantity;
                        item.UnitPrice = updatedItem.UnitPrice;
                        item.MenuItemId = updatedItem.MenuItemId;
                    }
                }

                await _context.SaveChangesAsync();
                return new { Error = false, Message = "Order updated successfully." };
            }
            catch (Exception ex)
            {
                return new { Error = true, Message = "Failed to update order.", Detail = ex.Message };
            }
        }

        public async Task<object> GetSubscribersAsync(int vendorId)
        {
            try
            {
                var subscribers = await _context.Subscribers
                    .Include(s => s.User)
                    .Include(s => s.SubscriptionType)
                    .Where(s => s.VendorId == vendorId)
                    .ToListAsync();

                return subscribers;
            }
            catch (Exception ex)
            {
                return new { Error = true, Message = "Failed to fetch subscribers.", Detail = ex.Message };
            }
        }

        public async Task<object> UpdateSubscriberTypeAsync(int vendorId, int subscriberId, int newSubscriptionTypeId)
        {
            try
            {
                var subscriber = await _context.Subscribers
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.SubscriberId == subscriberId);

                if (subscriber == null)
                    return new { Error = true, Message = "Subscriber not found." };

                var hasVendorOrder = await _context.Orders.AnyAsync(o => o.VendorId == vendorId && o.CustomerUserId == subscriber.UserId);
                if (!hasVendorOrder)
                    return new { Error = true, Message = "Vendor cannot update this subscriber." };

                subscriber.SubscriptionTypeId = newSubscriptionTypeId;
                subscriber.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return new { Error = false, Message = "Subscriber updated successfully." };
            }
            catch (Exception ex)
            {
                return new { Error = true, Message = "Failed to update subscriber.", Detail = ex.Message };
            }
        }

        public async Task<object> GetUserDetailsAsync(int customerUserId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.SubscriptionType)
                    .FirstOrDefaultAsync(u => u.UserId == customerUserId);

                if (user == null)
                    return new { Error = true, Message = "User not found." };

                return new
                {
                    Error = false,
                    user.UserId,
                    user.FullName,
                    user.Email,
                    user.Phone,
                    Role = user.Role.RoleName,
                    SubscriptionType = user.SubscriptionType.SubscriptionName
                };
            }
            catch (Exception ex)
            {
                return new { Error = true, Message = "Failed to fetch user details.", Detail = ex.Message };
            }
        }

    }
}
