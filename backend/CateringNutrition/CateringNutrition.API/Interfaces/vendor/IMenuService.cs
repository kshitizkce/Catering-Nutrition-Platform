using CateringNutrition.API.Models.vendor;

namespace CateringNutrition.API.Interfaces.vendor
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuItems>> GetMenuItemsByCategoriesAsync(List<int> categoryIds);

        Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAsync(int vendorId);

        Task<IEnumerable<Vendors>> GetAllVendorsAsync();

        Task<IEnumerable<Category>> GetAllCategoriesAsync();
    }
}