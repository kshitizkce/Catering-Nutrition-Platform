using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.OrderItemDto;
using CateringNutrition.API.Dtos.vendorDto;
using CateringNutrition.API.Models.vendor;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.vendorservice
{
    public class VendorService
    {
        private readonly AppDbContext _context;

        private readonly IWebHostEnvironment _env;

        public VendorService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;



        }

        public async Task<object> GetVendorByUserId(int userId)
        {
            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.UserId == userId);

            if (vendor == null)
                throw new Exception("Vendor not found");

            return new
            {
                vendorId = vendor.VendorId,
                vendorName = vendor.VendorName
            };
        }

        public async Task<ServiceResult<List<OrderWithItemsDto>>> GetOrdersWithItemsAsync(int vendorId)
        {
            try
            {
                // Fetch all orders for this vendor and include customer + items + menu + category
                var orders = await _context.Orders
                    .Where(o => o.VendorId == vendorId)
                    .Include(o => o.Customer)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.MenuItem)
                            .ThenInclude(mi => mi.Category)
                    .ToListAsync();

                // Fetch vendor rating safely (nullable, default 0 if not found)
                var vendorRating = await _context.Vendors
                    .Where(v => v.VendorId == vendorId)
                    .Select(v => (decimal?)v.Rating) // cast to nullable decimal
                    .FirstOrDefaultAsync() ?? 0;

                // Map orders to DTO
                var result = orders.Select(o => new OrderWithItemsDto
                {
                    OrderId = o.OrderId,
                    CustomerName = o.Customer?.FullName ?? "Unknown",
                    CustomerEmail = o.Customer?.Email ?? "",
                    CustomerPhone = o.Customer?.Phone ?? "",
                    StatusId = o.OrderStatusId,

                    Status = o.OrderStatusId == 1 ? "Cancelled" : 
                             o.OrderStatusId == 2 ? "Pending" :
                             o.OrderStatusId == 3 ? "Confirmed" :
                             o.OrderStatusId == 4 ? "Shipped" :
                             o.OrderStatusId == 5 ? "Delivered" : "Unknown",
                    OrderDate = o.OrderDate,
                    DeliveryAddress = o.DeliveryAddress,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,

                    // Include vendor rating safely
                    VendorRating = vendorRating,

                    Items = o.OrderItems?.Select(oi => new OrderItemDto
                    {
                        OrderItemId = oi.OrderItemId,
                        MenuItemId = oi.MenuItemId,
                        ItemName = oi.MenuItem?.ItemName ?? "",
                        CategoryName = oi.MenuItem?.Category?.CategoryName ?? "",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        Calories = oi.MenuItem?.Calories ?? 0,
                        Rating = (double)(oi.MenuItem?.Rating ?? 0),
                        Price = oi.MenuItem?.Price ?? 0,
                        IsAvailable = oi.MenuItem?.IsAvailable ?? false
                    }).ToList() ?? new List<OrderItemDto>()
                }).ToList();

                return new ServiceResult<List<OrderWithItemsDto>> { Data = result };
            }
            catch (Exception ex)
            {
                // log ex if needed
                return new ServiceResult<List<OrderWithItemsDto>>
                {
                    Error = true,
                    Message = "Failed to fetch orders.",
                    Data = new List<OrderWithItemsDto>()
                };
            }
        }


        public async Task<object> GetOrdersAsync(int vendorId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.VendorId == vendorId)
                    .Include(o => o.Customer)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.MenuItem)
                            .ThenInclude(mi => mi.Category) 
                    .ToListAsync();

                var result = orders.Select(o => new
                {
                    orderId = o.OrderId,

                    customerName = o.Customer.FullName,
                    customerEmail = o.Customer.Email,
                    customerPhone = o.Customer.Phone,

                    statusId = o.OrderStatusId,

                    status = o.OrderStatusId == 1 ? "Cancelled" : 
                               o.OrderStatusId == 2 ? "Pending" :
                             o.OrderStatusId == 3 ? "Confirmed" :
                             o.OrderStatusId == 4 ? "Shipped" :
                             o.OrderStatusId == 5 ? "Delivered" : "Unknown",

                    orderDate = o.OrderDate,
                    deliveryAddress = o.DeliveryAddress,
                    totalAmount = o.TotalAmount,
                    createdAt = o.CreatedAt,
                    updatedAt = o.UpdatedAt,

                    // ✅ ORDER ITEMS + MENU DETAILS
                    items = o.OrderItems.Select(i => new
                    {
                        orderItemId = i.OrderItemId,
                        quantity = i.Quantity,
                        unitPrice = i.UnitPrice,

                        menuItemId = i.MenuItemId,
                        itemName = i.MenuItem.ItemName,
                        description = i.MenuItem.ItemDescription,
                        rating = i.MenuItem.Rating,
                        price = i.MenuItem.Price,
                        calories = i.MenuItem.Calories,

                        categoryName = i.MenuItem.Category.CategoryName
                    })
                });

                return result;
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
                    .Include(s => s.User)  // includes the related User
                    .FirstOrDefaultAsync(s => s.SubscriberId == subscriberId);

                if (subscriber == null)
                    return new { Error = true, Message = "Subscriber not found." };

                var hasVendorOrder = await _context.Orders
                    .AnyAsync(o => o.VendorId == vendorId && o.CustomerUserId == subscriber.UserId);

                if (!hasVendorOrder)
                    return new { Error = true, Message = "Vendor cannot update this subscriber." };

                // Update subscriber table
                subscriber.SubscriptionTypeId = newSubscriptionTypeId;
                subscriber.UpdatedAt = DateTime.UtcNow;

                // Update corresponding user table
                if (subscriber.User != null)
                {
                    subscriber.User.SubscriptionTypeId = newSubscriptionTypeId;
                }

                await _context.SaveChangesAsync();

                return new { Error = false, Message = "Subscriber and user updated successfully." };
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
        public async Task<VendorProfileDto> GetVendorProfile(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.UserId == userId);

            // ✅🔥 CREATE VENDOR IF NOT EXISTS
            if (vendor == null)
            {
                vendor = new Vendors
                {
                    UserId = user.UserId,
                    VendorName = user.FullName,
                    BusinessDescription = null,
                    VendorPhone = null,
                    VendorEmail = null,
                    VendorAddress = null,
                    City = null,
                    Rating = null,
                    Status = "Not Verified", // or "Inactive" based on your constraint
                    CreatedAt = DateTime.Now,
                    UpdatedAt = null,
                    BusinessHours = null,
                    BusinessLogo = null,
                    BusinessFile = null,
                    MealCateringStatus=0
                };

                _context.Vendors.Add(vendor);
                await _context.SaveChangesAsync();
            }

            return new VendorProfileDto
            {
                UserId = user.UserId,
                OwnerName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,

                BusinessName = vendor.VendorName,
                BusinessDescription = vendor.BusinessDescription,
                VendorAddress = vendor.VendorAddress,
                City = vendor.City,
                ContactEmail = vendor.VendorEmail,
                ContactPhone = vendor.VendorPhone,
                BusinessHours = vendor.BusinessHours,
                BusinessLogo = vendor.BusinessLogo,
                BusinessFile = vendor.BusinessFile,
                MealCateringStatus = vendor.MealCateringStatus
            };
        }

        public async Task<string> SaveVendorProfile(VendorProfileDto dto, IFormFile? logo, IFormFile? file)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found");

            // UPDATE USER
            user.FullName = dto.OwnerName;
            user.Email = dto.Email;
            user.Phone = dto.Phone;

            if (!string.IsNullOrEmpty(dto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password); 


            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.UserId == dto.UserId);

            if (vendor == null)
            {
                vendor = new Vendors
                {
                    UserId = dto.UserId,
                    CreatedAt = DateTime.Now
                };
                _context.Vendors.Add(vendor);
            }

            string uploadPath = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            // LOGO
            if (logo != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(logo.FileName);
                var path = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await logo.CopyToAsync(stream);

                vendor.BusinessLogo = "/uploads/" + fileName;
            }

            // BUSINESS FILE
            if (file != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var path = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await file.CopyToAsync(stream);

                vendor.BusinessFile = "/uploads/" + fileName;
            }

            // UPDATE VENDOR
            vendor.VendorName = dto.BusinessName;
            vendor.BusinessDescription = dto.BusinessDescription;
            vendor.VendorAddress = dto.VendorAddress;
            vendor.City = dto.City;
            vendor.VendorEmail = dto.ContactEmail;
            vendor.VendorPhone = dto.ContactPhone;
            vendor.BusinessHours = dto.BusinessHours;
            vendor.MealCateringStatus = dto.MealCateringStatus;
            vendor.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return "Vendor profile saved successfully";
        }
    }

}

