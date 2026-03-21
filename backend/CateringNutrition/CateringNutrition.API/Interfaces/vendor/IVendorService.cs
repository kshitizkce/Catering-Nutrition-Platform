using CateringNutrition.API.Dtos.vendorDto;

namespace CateringNutrition.API.Interfaces.vendor
{
    public interface IVendorService
    {
        Task<VendorProfileDto> GetVendorProfile(int userId);
        Task<string> SaveVendorProfile(VendorProfileDto dto, IFormFile? logo, IFormFile? file);
        Task<object> GetVendorByUserId(int userId);

    }
}
