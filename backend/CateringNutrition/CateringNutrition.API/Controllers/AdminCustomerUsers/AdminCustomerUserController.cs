using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers.AdminCustomerUsers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminCustomerUserController : ControllerBase
    {

    
        private readonly Interfaces.adminInterface.IAdminCustomerUsersService _userService;

        public AdminCustomerUserController(IAdminCustomerUsersService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        

            [HttpGet("{userId}")]
            public async Task<IActionResult> GetCustomer(int userId, int pageNumber = 1, int pageSize = 10)
            {
                var result = await _userService.GetCustomerDetailsAsync(userId, pageNumber, pageSize);
                if (result == null) return NotFound();
                return Ok(result);
            }
       

            [HttpGet("allorders")]
            public async Task<ActionResult<List<AdminOrderDto>>> GetAllOrders()
            {
                var orders = await _userService.GetAllOrdersAsync();
                return Ok(orders);
            }
        }
}
