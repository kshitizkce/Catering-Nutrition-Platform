using CateringNutrition.API.Models;

namespace CateringNutrition.API.Interfaces
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuItems>> GetMenuItemsByCategoriesAsync(List<int> categoryIds);

        Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAsync(int vendorId);

        Task<IEnumerable<Vendors>> GetAllVendorsAsync();

        Task<IEnumerable<MenuCategories>> GetAllCategoriesAsync();
    }
}