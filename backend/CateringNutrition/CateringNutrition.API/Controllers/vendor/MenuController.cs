using CateringNutrition.API.Dtos.menuitemsDTOS;
using CateringNutrition.API.Interfaces.vendor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers.vendor
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


        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {

            var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // Create the folder if it doesn't exist
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(imagesFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Build URL for frontend
            var url = $"http://localhost:5197/images/{fileName}";
            return Ok(new { imageUrl = url });
        }

        // ✅ Add menu item
        [HttpPost("menuitems")]
        public async Task<IActionResult> AddMenuItem([FromBody] MenuItemDto dto)
        {
            var item = await _service.AddMenuItemAsync(dto);
            return Ok(item);
        }

        // ✅ Update menu item
        [HttpPut("menuitems/{menuItemId}")]
        public async Task<IActionResult> UpdateMenuItem(int menuItemId, [FromBody] MenuItemDto dto)
        {
            var updated = await _service.UpdateMenuItemAsync(menuItemId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // ✅ Delete menu item
        [HttpDelete("menuitems/{menuItemId}")]
        public async Task<IActionResult> DeleteMenuItem(int menuItemId)
        {
            var deleted = await _service.DeleteMenuItemAsync(menuItemId);
            if (!deleted) return NotFound();
            return Ok();
        }


        //return menu items of that vendor id and category filter as well pagination feature
        [HttpPost("menuitems/vendor/categories/{vendorId}")]
        public async Task<IActionResult> GetMenuItemsByVendorAndCategories(
    int vendorId,
    [FromBody] List<int> categoryIds,
    int pageNumber = 1,
    int pageSize = 50)
        {
            var result = await _service.GetMenuItemsByVendorAndCategoriesAsync(
                vendorId,
                categoryIds,
                pageNumber,
                pageSize
            );

            return Ok(result);
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
