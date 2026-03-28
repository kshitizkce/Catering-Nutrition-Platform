using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.admimCustomers;
using CateringNutrition.API.Dtos.adminVendors;
using CateringNutrition.API.Interfaces.adminInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

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


        [HttpGet("all")]
       public async Task<IActionResult> GetAllVendors()
        {
            var vendors = await _context.Vendors
                .Select(v => new VendorDto
                {
                    VendorId = v.VendorId,
                    VendorName = v.VendorName,
                    VendorEmail = v.VendorEmail,
                    VendorPhone = v.VendorPhone,
                    City = v.City,
                    Status = v.Status,

                    // 🔥 NEW FIELDS
                    VendorAddress = v.VendorAddress,
                    Rating = v.Rating,
                    BusinessHours = v.BusinessHours,
                    BusinessLogo = v.BusinessLogo,
                    BusinessFile = v.BusinessFile
                })
                .ToListAsync();

            return Ok(vendors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendor(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);

            if (vendor == null)
                return NotFound(new { message = "Vendor not found" });

            _context.Vendors.Remove(vendor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vendor deleted successfully" });
        }



        // PUT: api/adminvendor/approve/{id}
        [HttpPut("approve/{id}")]
        public IActionResult ApproveVendor(int id)
        {
            var vendor = _context.Vendors.FirstOrDefault(v => v.VendorId == id);
            if (vendor == null) return NotFound();

            vendor.Status = "Approved"; // update status
            _context.SaveChanges();

            return Ok(vendor); // return updated vendor
        }

        [HttpPut("reject/{id}")]
        public IActionResult RejectVendor(int id)
        {
            var vendor = _context.Vendors.FirstOrDefault(v => v.VendorId == id);
            if (vendor == null) return NotFound();

            vendor.Status = "Rejected"; // update status
            _context.SaveChanges();

            return Ok(vendor);
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


    }
}
