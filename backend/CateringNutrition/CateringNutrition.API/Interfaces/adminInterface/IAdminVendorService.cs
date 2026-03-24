using CateringNutrition.API.Dtos.adminVendors;

namespace CateringNutrition.API.Interfaces.adminInterface
{
    public interface IAdminVendorService
    {
        Task<AdminVendorDetailsDto> GetVendorDetailsAsync(int vendorId, int pageNumber, int pageSize);

    }
}
