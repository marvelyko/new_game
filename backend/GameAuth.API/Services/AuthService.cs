using GameAuth.API.Data;
using GameAuth.API.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace GameAuth.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<User?> GetUserByNicknameAsync(string nickname);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if phone number already exists
            if (await _context.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Phone number is already registered"
                };
            }

            // Check if nickname already exists
            if (await _context.Users.AnyAsync(u => u.Nickname == request.Nickname))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Nickname is already taken"
                };
            }

            // Create new user
            var user = new User
            {
                PhoneNumber = request.PhoneNumber,
                Nickname = request.Nickname,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                User = user
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Nickname == request.Nickname);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid nickname or password"
                };
            }

            return new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                User = user
            };
        }

        public async Task<User?> GetUserByNicknameAsync(string nickname)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Nickname == nickname);
        }
    }
}
