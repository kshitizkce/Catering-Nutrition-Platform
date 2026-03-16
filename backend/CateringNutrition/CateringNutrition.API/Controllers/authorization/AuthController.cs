using CateringNutrition.API.Dtos;
using CateringNutrition.API.Dtos.authorization;
using CateringNutrition.API.Interfaces;
using CateringNutrition.API.Interfaces.authorization;
using CateringNutrition.API.Services.authorizationservice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringNutrition.API.Controllers.authorization
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        private readonly TwilioVerifyService _twilioService;



        public AuthController(IAuthService service, TwilioVerifyService twilioService)
        {
            _service = service;
            _twilioService = twilioService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto, [FromQuery] string roleType)
        {
            if (string.IsNullOrEmpty(roleType))
                roleType = "customer";

            var result = await _service.RegisterAsync(dto, roleType);

            var message = result?.ToString();

            if (message.Contains("already"))
                return BadRequest(new { message });

            if (message.Contains("required"))
                return BadRequest(new { message });

            return Ok(new { message });
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var result = await _service.ForgotPasswordAsync(dto.Email);

            return Ok(new { message = result });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _service.ResetPasswordAsync(dto);

            if (result == "Invalid reset token" || result == "Reset token expired")
                return BadRequest(result);

            return Ok(new { message = result });
        }


        [HttpPost("send-sms-otp")]
        public async Task<IActionResult> SendSmsOtp([FromBody] SendSmsOtpDto dto)
        {
            await _twilioService.SendOtp(dto.Phone);
            return Ok(new { message = "OTP sent successfully" });
        }

        [HttpPost("verify-sms-otp")]
        public async Task<IActionResult> VerifySmsOtp([FromBody] VerifySmsOtpDto dto)
        {
            var result = await _twilioService.VerifyOtp(dto.Phone, dto.Otp);

            if (!result)
                return BadRequest(new { message = "Invalid OTP" });

            return Ok(new { message = "Phone verified successfully" });
        }

        [HttpPost("send-email-otp")]
        public async Task<IActionResult> SendEmailOtp([FromBody] SendEmailOtpDto dto)
        {
            await _service.SendEmailOtpAsync(dto.Email);
            return Ok(new { message = "OTP sent successfully" });
        }

        [HttpPost("verify-email-otp")]
        public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyEmailOtpDto dto)
        {
            var result = await _service.VerifyEmailOtpAsync(dto.Email, dto.Otp);

            if (!result)
                return BadRequest(new { message = "Invalid OTP" });

            return Ok(new { message = "Email verified successfully" });
        }
    }


    }

    