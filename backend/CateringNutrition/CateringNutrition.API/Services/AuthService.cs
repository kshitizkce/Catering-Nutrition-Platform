using CateringNutrition.API.Data;
using CateringNutrition.API.Dtos;
using CateringNutrition.API.Interfaces;
using CateringNutrition.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CateringNutrition.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        private readonly JwtService _jwt;


        public AuthService(AppDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        public async Task<object> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
        .Include(u => u.Role)
        .Include(u => u.SubscriptionType)
        .FirstOrDefaultAsync(u =>
            u.Email == dto.Email &&
            u.Password == dto.Password);

            if (user == null)
                return null;

            var token = _jwt.GenerateToken(
                user.Email,
                user.Role.RoleName,
                user.UserId);

            return new
            {
                user.UserId,
                user.FullName,
                user.Email,
                Role = user.Role.RoleName,
                Token = token
            };

        }

        public async Task<string> RegisterAsync(RegisterDto dto, string roleType)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return "Email already exists";

            // Ensure roleId exists in Roles table
            int roleId = roleType.ToLower() == "vendor" ? 2 : 1;

            // Ensure subscriptionTypeId exists in SubscriptionTypes table
            int subscriptionTypeId = 1; // 1 = Free, 2 = Paid (adjust if needed)

            var user = new Users
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,
                RoleId = roleId, // mapped from roleType header
                SubscriptionTypeId = dto.SubscriptionTypeId, // must match DB column
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User Registered Successfully";
        }
    }
}