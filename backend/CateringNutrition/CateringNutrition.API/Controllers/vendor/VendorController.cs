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

            public VendorController(VendorService service)
            {
                _service = service;
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

            [HttpPut("{vendorId}/subscriber/{subscriberId}")]
            public async Task<IActionResult> UpdateSubscriberType(int vendorId, int subscriberId, [FromBody] int newSubscriptionTypeId)
            {
                var result = await _service.UpdateSubscriberTypeAsync(vendorId, subscriberId, newSubscriptionTypeId);
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