using CateringNutrition.API.Data;
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

        // 4️⃣ All categories
        public async Task<IEnumerable<MenuCategories>> GetAllCategoriesAsync()
        {
            return await _context.MenuCategories
                .Where(c => c.IsActive)
                .ToListAsync();
        }
    }
}