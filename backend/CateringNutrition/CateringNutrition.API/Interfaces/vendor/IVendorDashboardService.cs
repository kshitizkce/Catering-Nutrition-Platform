using CateringNutrition.API.Dtos.vendorDto;

namespace CateringNutrition.API.Interfaces.vendor
{
    public interface IVendorDashboardService
    {
        Task<VendorDashboardDto> GetDashboardAsync(int vendorId);

    }
}
