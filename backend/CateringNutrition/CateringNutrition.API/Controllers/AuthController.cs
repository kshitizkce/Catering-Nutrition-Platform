using CateringNutrition.API.Dtos;
using CateringNutrition.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto, [FromQuery] string roleType)
        {
            if (string.IsNullOrEmpty(roleType))
                roleType = "customer"; // default role

            var result = await _service.RegisterAsync(dto, roleType); // pass roleType to service

            if (result == "Email already exists")
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _service.LoginAsync(dto);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }
        [Authorize]
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("JWT authentication working");
        }
    }
}