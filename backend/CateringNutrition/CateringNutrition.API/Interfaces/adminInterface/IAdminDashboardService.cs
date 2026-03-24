using CateringNutrition.API.Dtos.adminDashboard;

namespace CateringNutrition.API.Interfaces.adminInterface
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardDto> GetDashboardDataAsync();
    }
}
