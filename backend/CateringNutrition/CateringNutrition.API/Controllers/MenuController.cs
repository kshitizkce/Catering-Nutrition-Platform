using CateringNutrition.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _service;

        public MenuController(IMenuService service)
        {
            _service = service;
        }

        // 1️⃣ Menu items by category selection
        [HttpPost("menuitems/categories")]
        public async Task<IActionResult> GetMenuItemsByCategories([FromBody] List<int> categoryIds)
        {
            var result = await _service.GetMenuItemsByCategoriesAsync(categoryIds);
            return Ok(result);
        }

        // 2️⃣ Menu items by vendor
        [HttpGet("menuitems/vendor/{vendorId}")]
        public async Task<IActionResult> GetMenuItemsByVendor(int vendorId)
        {
            var result = await _service.GetMenuItemsByVendorAsync(vendorId);
            return Ok(result);
        }

        // 3️⃣ Get all vendors
        [HttpGet("vendors")]
        public async Task<IActionResult> GetAllVendors()
        {
            var result = await _service.GetAllVendorsAsync();
            return Ok(result);
        }

        // 4️⃣ Get all categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var result = await _service.GetAllCategoriesAsync();
            return Ok(result);
        }
    }
}
