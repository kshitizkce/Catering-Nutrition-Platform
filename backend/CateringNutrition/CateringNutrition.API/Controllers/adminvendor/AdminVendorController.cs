using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Controllers.adminvendor
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminVendorController : ControllerBase
    {
        private readonly IAdminVendorService _service;

        private readonly AppDbContext _context;

        

        public AdminVendorController(IAdminVendorService adminVendorService, AppDbContext context)
        {
            _service = adminVendorService;
            _context = context;
        }


        [HttpGet("{vendorId}")]
        public async Task<IActionResult> GetVendorDetails(
    int vendorId,
    int pageNumber = 1,
    int pageSize = 10)
        {
            var result = await _service.GetVendorDetailsAsync(vendorId, pageNumber, pageSize);

            if (result == null)
                return NotFound();

            return Ok(result);
        }


        [HttpGet("all")] // GET api/adminvendor/all
        public async Task<IActionResult> GetAllVendors()
        {
            List<VendorDto> vendors = await _context.Vendors
                .Select(v => new VendorDto
                {
                    VendorId = v.VendorId,
                    VendorName = v.VendorName,
                    VendorEmail = v.VendorEmail,
                    VendorPhone = v.VendorPhone,
                    City = v.City,
                    Status = v.Status
                })
                .ToListAsync<VendorDto>(); // Explicitly specify the type

            return Ok(vendors);
        }
    }
}
