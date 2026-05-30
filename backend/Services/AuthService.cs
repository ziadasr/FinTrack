using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FinTrack.Api.Data;
using FinTrack.Api.DTOs;
using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> Login(LoginRequest request);
    Task<LoginResponse?> Register(RegisterRequest request);
    Task<bool> IsSetupComplete();
    Task<LoginResponse?> ResetPassword(string username, string newPassword);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<bool> IsSetupComplete()
    {
        return await _context.Users.AnyAsync();
    }

    public async Task<LoginResponse?> Register(RegisterRequest request)
    {
        var exists = await _context.Users.AnyAsync();
        if (exists) return null;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            Token = GenerateToken(user),
            Username = user.Username
        };
    }

    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null) return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        return new LoginResponse
        {
            Token = GenerateToken(user),
            Username = user.Username
        };
    }

    public async Task<LoginResponse?> ResetPassword(string username, string newPassword)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null) return null;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            Token = GenerateToken(user),
            Username = user.Username
        };
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim("userId", user.Id.ToString()),
            new Claim("username", user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
