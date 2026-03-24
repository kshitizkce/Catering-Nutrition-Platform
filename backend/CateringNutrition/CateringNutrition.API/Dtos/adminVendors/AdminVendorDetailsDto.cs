using CateringNutrition.API.Dtos.vendorDto;

namespace CateringNutrition.API.Dtos.adminVendors
{
    public class AdminVendorDetailsDto
    {
        public VendorDto Vendor { get; set; }

        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public PagedResultDto<AdminOrderDto> Orders { get; set; }


        public TopMenuItemDto TopSellingItem { get; set; }
    }
}
