using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos.authorization;
using CateringNutrition.API.Interfaces.authorization;
using CateringNutrition.API.Models;
using CateringNutrition.API.Models.authorization;
using CateringNutrition.API.Models.vendor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace CateringNutrition.API.Services.authorizationservice
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        private readonly JwtService _jwt;
        private static readonly Dictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();



        public AuthService(AppDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }


        public async Task<string> SendEmailOtpAsync(string email)
        {
            // 1️⃣ Generate 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // 2️⃣ Store OTP with expiry (5 minutes)
            _otpStore[email] = (otp, DateTime.UtcNow.AddMinutes(5));

            // 3️⃣ Send OTP via SMTP (Gmail example)
            var smtp = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    "kshitizkce77@gmail.com", 
                    "dqur yfym xteq umve"     
                )
            };

            var message = new MailMessage
            {
                From = new MailAddress("kshitizkce77@gmail.com", "Catering&MealService"),
                Subject = "Your OTP Code",
                Body = $"Your OTP is {otp}. It expires in 5 minutes.",
                IsBodyHtml = true
            };

            message.To.Add(email);

            await smtp.SendMailAsync(message);

            return "OTP sent successfully";
        }

        public Task<bool> VerifyEmailOtpAsync(string email, string otp)
        {
            if (_otpStore.TryGetValue(email, out var record))
            {
                if (record.Otp == otp && record.Expiry > DateTime.UtcNow)
                {
                    _otpStore.Remove(email); // OTP used, remove from store
                    return Task.FromResult(true);
                }
            }

            return Task.FromResult(false);
        }

        public async Task<object> RegisterAsync(RegisterDto dto, string roleType)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Email))
                    return new { message = "Email is required" };

                if (string.IsNullOrWhiteSpace(dto.FullName))
                    return new { message = "Full name is required" };

                if (string.IsNullOrWhiteSpace(dto.Password))
                    return new { message = "Password is required" };

                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                    return new { message = "This email is already registered" };

                // Map roleType to RoleId
                int roleId;
                switch (roleType.ToLower())
                {
                    case "vendor":
                        roleId = 2;
                        break;
                    case "customer":
                    default:
                        roleId = 1;
                        break;
                }

                int subscriptionTypeId = dto.SubscriptionTypeId > 0 ? dto.SubscriptionTypeId : 1;

                var user = new Users
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    RoleId = roleId,
                    SubscriptionTypeId = subscriptionTypeId,
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync(); // ✅ UserId generated here

                // ✅ INSERT INTO VENDORS TABLE (ONLY IF VENDOR)
                if (roleId == 2 || roleId == 3) // Vendor
                {
                    var vendor = new Vendors
                    {
                        UserId = user.UserId, // 🔥 FK
                        VendorName = user.FullName,
                        BusinessDescription = null,
                        VendorPhone = null,
                        VendorEmail = null,
                        VendorAddress = null,
                        City = null,
                        Rating = null,
                        Status = "Not Verified",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = null,
                        BusinessHours = null,
                        BusinessLogo = null,
                        BusinessFile = null
                    };

                    _context.Vendors.Add(vendor);
                    await _context.SaveChangesAsync();
                }

                return new { message = "User registered successfully" };
            }
            catch (DbUpdateException dbEx)
            {
                if (dbEx.InnerException != null)
                {
                    var message = dbEx.InnerException.Message;

                    if (message.Contains("UQ_Users_Email"))
                        return new { message = "This email is already used by another user" };

                    if (message.Contains("FK_Users_Roles"))
                        return new { message = "Invalid role selected" };

                    if (message.Contains("FK_Users_SubscriptionTypes"))
                        return new { message = "Invalid subscription type selected" };
                }

                return new { message = "Database error occurred while registering user" };
            }
            catch (Exception)
            {
                return new { message = "An unexpected error occurred. Please try again later" };
            }
        }

        public async Task<object> LoginAsync(LoginDto dto)
        {
            try
            {
                // 1️⃣ Basic validation
                if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                    return "Email and password are required";

                // 2️⃣ Fetch user with role and subscription
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.SubscriptionType)
                    .FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null)
                    return "Invalid email or password";

                // 3️⃣ Verify password
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
                if (!isPasswordValid)
                    return "Invalid email or password";

                // 4️⃣ Generate JWT token
                var token = _jwt.GenerateToken(
                    user.Email,
                    user.Role.RoleName,
                    user.UserId);

                // 5️⃣ Determine all roles for multi-role login
                var roles = new List<string>();

                switch (user.RoleId)
                {
                    case 1: // Customer
                        roles.Add("Customer");
                        break;
                    case 2: // Vendor
                        roles.Add("Vendor");
                        roles.Add("Customer");
                        break;
                    case 3: // Admin
                        roles.Add("Admin");
                        roles.Add("Vendor");
                        roles.Add("Customer");
                        break;
                }

                // 6️⃣ Return object for frontend
                return new
                {
                    user.UserId,
                    user.FullName,
                    user.Email,
                    Roles = roles,    // <-- frontend uses this
                    Token = token
                };
            }
            catch (Exception ex)
            {
                // Log ex.Message for debugging if needed
                return "An unexpected error occurred while logging in. Please try again later";
            }
        }

        public async Task<string> ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return "If the email exists, a reset link has been sent";

            // generate secure token
            var token = Guid.NewGuid().ToString();

            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            var resetLink = $"http://localhost:4200/reset-password?token={token}";

            // Send email
            await SendResetEmail(email, resetLink);

            return "Reset password link has been sent to your email";
        }

        private async Task SendResetEmail(string email, string link)
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

            var message = new MailMessage
            {
                From = new MailAddress("kshitizkce77@gmail.com"),
                Subject = "Reset Password",
                Body = $"Click the link to reset password: {link}",
                IsBodyHtml = true
            };

            message.To.Add(email);

            await smtp.SendMailAsync(message);
        }

        public async Task<string> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.ResetToken == dto.Token);

            if (user == null)
                return "Invalid reset token";

            if (user.ResetTokenExpiry < DateTime.UtcNow)
                return "Reset token expired";

            // Hash new password
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // clear reset token
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "Password reset successful";
        }

    }
}