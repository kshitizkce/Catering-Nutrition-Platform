using CateringNutrition.API.Dtos.menuitemsDTOS;
using CateringNutrition.API.Models.vendor;

namespace CateringNutrition.API.Interfaces.vendor
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuItems>> GetMenuItemsByCategoriesAsync(List<int> categoryIds);

        Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAsync(int vendorId);

        Task<IEnumerable<Vendors>> GetAllVendorsAsync();

        Task<IEnumerable<Category>> GetAllCategoriesAsync();

        Task<MenuItems> AddMenuItemAsync(MenuItemDto dto);
        Task<MenuItems> UpdateMenuItemAsync(int menuItemId, MenuItemDto dto);
        Task<bool> DeleteMenuItemAsync(int menuItemId);

        Task<IEnumerable<MenuItems>> GetMenuItemsByVendorAndCategoriesAsync(
        int vendorId,
        List<int> categoryIds,
        int pageNumber = 1,
        int pageSize = 50

    );

        Task<IEnumerable<MenuItems>> GetMenuItemsForAdminAsync(
    int vendorId,
    int categoryId,
    int pageNumber,
    int pageSize);


    }


}