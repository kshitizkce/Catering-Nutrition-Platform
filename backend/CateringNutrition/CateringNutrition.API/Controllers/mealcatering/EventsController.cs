using CateringNutrition.API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Controllers.mealcatering
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET BY VENDOR
        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetByVendor(int vendorId)
        {
            var events = await _context.CateringEvents
                .Where(x => x.VendorId == vendorId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(events);
        }

        // ✅ UPDATE STATUS
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var ev = await _context.CateringEvents.FindAsync(id);
            if (ev == null) return NotFound();

            ev.EventStatus = status;
            ev.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { status });
        }

        // ✅ SEND DETAILS + FILE + EMAIL
        [HttpPost("{id}/send-details")]
        public async Task<IActionResult> SendDetails(int id, IFormFile file, [FromForm] string message)
        {
            var ev = await _context.CateringEvents.FindAsync(id);
            if (ev == null) return NotFound("Event not found");

            var user = await _context.Users.FindAsync(ev.UserId);
            if (user == null) return NotFound("User not found");

            string filePath = "";

            // ✅ SAVE FILE
            if (file != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var fullPath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                filePath = "/uploads/" + fileName;
                ev.CateringDetailFile = filePath;
            }

            // ✅ CREATE TOKEN
            var token = Guid.NewGuid();

            _context.EventConfirmations.Add(new EventConfirmations
            {
                EventId = ev.EventId,
                Token = token,
                Expiry = DateTime.Now.AddDays(2),
                IsConfirmed = false,
                IsCancelled = false
            });

            ev.EventStatus = "Ready To View";

            await _context.SaveChangesAsync();

            //// 🔥 OPTION 1 (Use Angular + API)
            //var confirmUrl = $"http://localhost:4200/event-confirm/{token}";
            //var cancelUrl = $"http://localhost:4200/event-cancel/{token}";

             //🔥 OPTION 2(Direct backend test)
             var confirmUrl = $"http://localhost:5197/api/events/confirm/{token}";
            var cancelUrl = $"http://localhost:5197/api/events/cancel/{token}";

            await SendEmail(
                user.Email,
                "Event Details",
                GenerateHtmlEmail(message, confirmUrl, cancelUrl),
                filePath   // ✅ attach file
            );

            return Ok(new { message = "Email sent successfully" });
        }

        // ✅ CONFIRM
        [HttpGet("confirm/{token}")]
        public async Task<IActionResult> Confirm(Guid token)
        {
            var record = await _context.EventConfirmations
                .FirstOrDefaultAsync(x => x.Token == token && !x.IsConfirmed && !x.IsCancelled);

            if (record == null)
                return BadRequest("Invalid or already used token.");

            if (record.Expiry < DateTime.Now)
                return BadRequest("Link expired.");

            var ev = await _context.CateringEvents.FindAsync(record.EventId);
            if (ev == null) return NotFound("Event not found");

            ev.EventStatus = "Confirmed";

            record.IsConfirmed = true;
            record.ConfirmedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Event Confirmed ✅");
        }

        // ✅ CANCEL
        [HttpGet("cancel/{token}")]
        public async Task<IActionResult> Cancel(Guid token)
        {
            var record = await _context.EventConfirmations
                .FirstOrDefaultAsync(x => x.Token == token && !x.IsConfirmed && !x.IsCancelled);

            if (record == null)
                return BadRequest("Invalid or already used token.");

            if (record.Expiry < DateTime.Now)
                return BadRequest("Link expired.");

            var ev = await _context.CateringEvents.FindAsync(record.EventId);
            if (ev == null) return NotFound("Event not found");

            ev.EventStatus = "Cancelled";

            record.IsCancelled = true;
            record.CancelledAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Event Cancelled ❌");
        }

        // ================= EMAIL =================

        private async Task SendEmail(string to, string subject, string body, string filePath = null)
        {
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
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(to);

            // ✅ ATTACH FILE
            if (!string.IsNullOrEmpty(filePath))
            {
                try
                {
                    var fullPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        filePath.TrimStart('/')
                    );

                    if (System.IO.File.Exists(fullPath))
                    {
                        mail.Attachments.Add(new Attachment(fullPath));
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Attachment error: " + ex.Message);
                }
            }

            await smtp.SendMailAsync(mail);
        }

        private string GenerateHtmlEmail(string message, string confirmUrl, string cancelUrl)
        {
            return $@"
            <h2>Event Details</h2>
            <p>{message}</p>

            <br/>

            <a href='{confirmUrl}' 
               style='padding:10px 20px;background:green;color:white;text-decoration:none;border-radius:5px'>
                Confirm
            </a>

            <a href='{cancelUrl}' 
               style='padding:10px 20px;background:red;color:white;text-decoration:none;border-radius:5px;margin-left:10px'>
                Cancel
            </a>
            ";
        }
    }
}