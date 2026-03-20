using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.menuitemsDTOS;
using CateringNutrition.API.Interfaces.vendor;
using CateringNutrition.API.Models.vendor;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services.vendorservice
{
    public class MenuService : IMenuService
    {
        private readonly AppDbContext _context;

        public MenuService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MenuItems> AddMenuItemAsync(MenuItemDto dto)
        {
            var menuItem = new MenuItems
            {
                VendorId = dto.VendorId,
                CategoryId = dto.CategoryId,
                ItemName = dto.ItemName,
                ItemDescription = dto.ItemDescription,
                Price = dto.Price,
                Calories = dto.Calories,
                IsAvailable = dto.IsAvailable,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task<MenuItems> UpdateMenuItemAsync(int menuItemId, MenuItemDto dto)
        {
            var menuItem = await _context.MenuItems.FirstOrDefaultAsync(m => m.MenuItemId == menuItemId);
            if (menuItem == null) return null;

            menuItem.ItemName = dto.ItemName;
            menuItem.ItemDescription = dto.ItemDescription;
            menuItem.Price = dto.Price;
            menuItem.Calories = dto.Calories;
            menuItem.IsAvailable = dto.IsAvailable;
            menuItem.ImageUrl = dto.ImageUrl;
            menuItem.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task<bool> DeleteMenuItemAsync(int menuItemId)
        {
            var menuItem = await _context.MenuItems.FirstOrDefaultAsync(m => m.MenuItemId == menuItemId);
            if (menuItem == null) return false;

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Category
                .Where(c => c.IsActive)
                .ToListAsync();
        }
    


        //return menu items of that vendor id and category filter as well pagination feature
        public async Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAndCategoriesAsync(
    int vendorId,
    List<int> categoryIds,
    int pageNumber = 1,
    int pageSize = 50)
        {
            return await _context.MenuItems
                .Where(m => m.VendorId == vendorId
                         && categoryIds.Contains(m.CategoryId)
                         && m.IsAvailable)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // 1️⃣ Menu items for single or multiple categories
        public async Task<IEnumerable<MenuItems>> GetMenuItemsByCategoriesAsync(List<int> categoryIds)
        {
            return await _context.MenuItems
                .Where(m => categoryIds.Contains(m.CategoryId) && m.IsAvailable)
                .ToListAsync();
        }

        // 2️⃣ Menu items by vendor
        public async Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAsync(int vendorId)
        {
            return await _context.MenuItems
                .Where(m => m.VendorId == vendorId && m.IsAvailable)
                .ToListAsync();
        }

        // 3️⃣ All vendors
        public async Task<IEnumerable<Vendors>> GetAllVendorsAsync()
        {
            return await _context.Vendors
                .Where(v => v.Status == "Active")
                .ToListAsync();
        }

        
    }
}