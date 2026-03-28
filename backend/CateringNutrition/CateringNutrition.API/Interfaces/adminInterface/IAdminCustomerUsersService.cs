using CateringNutrition.API.Dtos.admimCustomers;
using CateringNutrition.API.Dtos.adminVendors;

namespace CateringNutrition.API.Interfaces.adminInterface
{
    public interface IAdminCustomerUsersService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<AdminCustomerUserDetailsDto> GetCustomerDetailsAsync(int userId, int pageNumber, int pageSize);

        Task<List<AdminOrderDto>> GetAllOrdersAsync();

        Task<bool> DeleteUserAsync(int userId);

    }
}
