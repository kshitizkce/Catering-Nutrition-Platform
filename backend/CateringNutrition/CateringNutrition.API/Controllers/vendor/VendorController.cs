using CateringNutrition.API.Dtos.vendorDto;
using CateringNutrition.API.Services.vendorservice;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers.vendor
{
        [ApiController]
        [Route("api/vendor")]
        public class VendorController : ControllerBase
        {
            private readonly VendorService _service;

        private readonly VendorDashboardService _dashboardService;

            public VendorController(VendorService service, VendorDashboardService dashboardService)
            { 
                _service = service;

            _dashboardService = dashboardService;
            }


        // ✅ GET vendor dashboard (vendor info + revenue + recent orders)
        [HttpGet("{vendorId}/dashboard")]
        public async Task<IActionResult> GetDashboard(int vendorId)
        {
            var dashboard = await _dashboardService.GetDashboardAsync(vendorId);

            if (dashboard == null)
                return NotFound(new { message = "Vendor not found" });

            return Ok(dashboard);
        }

        [HttpGet("{vendorId}/orders")]
            public async Task<IActionResult> GetOrders(int vendorId)
            {
                var result = await _service.GetOrdersAsync(vendorId);
                return result is IDictionary<string, object> dict && dict.ContainsKey("Error") && (bool)dict["Error"]
                    ? StatusCode(500, result)
                    : Ok(result);
            }

        [HttpPut("{vendorId}/order/{orderId}")]
        public async Task<IActionResult> UpdateOrder(int vendorId, int orderId, [FromBody] UpdateOrderDto updatedOrder)
        {
            var result = await _service.UpdateOrderAsync(vendorId, orderId, updatedOrder);

            return result is IDictionary<string, object> dict && dict.ContainsKey("Error") && (bool)dict["Error"]
                ? StatusCode(500, result)
                : Ok(result);
        }

        [HttpGet("{vendorId}/subscribers")]
            public async Task<IActionResult> GetSubscribers(int vendorId)
            {
                var result = await _service.GetSubscribersAsync(vendorId);
                return result is IDictionary<string, object> dict && dict.ContainsKey("Error") && (bool)dict["Error"]
                    ? StatusCode(500, result)
                    : Ok(result);
            }

        public class UpdateSubscriberDto
        {
            public int SubscriptionTypeId { get; set; }
        }

        [HttpPut("{vendorId}/subscriber/{subscriberId}")]
        public async Task<IActionResult> UpdateSubscriberType(
            int vendorId,
            int subscriberId,
            [FromBody] UpdateSubscriberDto dto)
        {
            var result = await _service.UpdateSubscriberTypeAsync(vendorId, subscriberId, dto.SubscriptionTypeId);
            return result is IDictionary<string, object> dict && dict.ContainsKey("Error") && (bool)dict["Error"]
                ? StatusCode(500, result)
                : Ok(result);
        }

        [HttpGet("user/{customerUserId}")]
            public async Task<IActionResult> GetUserDetails(int customerUserId)
            {
                var result = await _service.GetUserDetailsAsync(customerUserId);
                return result is IDictionary<string, object> dict && dict.ContainsKey("Error") && (bool)dict["Error"]
                    ? StatusCode(500, result)
                    : Ok(result);
            }

        }

    }