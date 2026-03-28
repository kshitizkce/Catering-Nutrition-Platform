using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.admimCustomers;
using CateringNutrition.API.Dtos.adminProfile;
using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace CateringNutrition.API.Controllers.AdminCustomerUsers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminCustomerUserController : ControllerBase
    {

    
        private readonly Interfaces.adminInterface.IAdminCustomerUsersService _userService;

        private readonly AppDbContext _context;

        public AdminCustomerUserController(IAdminCustomerUsersService userService, AppDbContext context)
        {
            _userService = userService;
            _context = context;

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendVendorEmail([FromBody] VendorEmailDto request)
        {
            if (string.IsNullOrEmpty(request.ToEmail) || string.IsNullOrEmpty(request.Message))
                return BadRequest("Email or message is missing.");

            var smtp = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    "kshitizkce77@gmail.com",
                    "dqur yfym xteq umve"
                )
            };

            var mail = new MailMessage
            {
                From = new MailAddress("kshitizkce77@gmail.com"),
                Subject = request.Subject ?? "Vendor Notification",
                Body = request.Message,
                IsBodyHtml = true
            };

            mail.To.Add(request.ToEmail);

            try
            {
                await smtp.SendMailAsync(mail);
                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] AdminProfileUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound("User not found");

            if (!string.IsNullOrEmpty(dto.OwnerName))
                user.FullName = dto.OwnerName;

            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.Phone))
                user.Phone = dto.Phone;

            if (!string.IsNullOrEmpty(dto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }

    }
}
