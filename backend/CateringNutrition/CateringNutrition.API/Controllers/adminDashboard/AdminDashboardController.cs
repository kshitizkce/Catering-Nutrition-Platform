using CateringNutrition.API.Dtos.adminDashboard;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers.adminDashboard
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _admindashboardService;

        public AdminDashboardController(IAdminDashboardService aadmindashboardService)
        {
            _admindashboardService = aadmindashboardService;
        }

        [HttpGet]
        public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
        {
            var data = await _admindashboardService.GetDashboardDataAsync();
            return Ok(data);
        }
    }
}
