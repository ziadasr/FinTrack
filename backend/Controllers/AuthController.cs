using Microsoft.AspNetCore.Mvc;
using FinTrack.Api.DTOs;
using FinTrack.Api.Services;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        var isSetup = await _authService.IsSetupComplete();
        return Ok(new { isSetupComplete = isSetup });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
            return BadRequest(new { message = "Username is required" });
        if (request.Username.Length < 3 || request.Username.Length > 50)
            return BadRequest(new { message = "Username must be between 3 and 50 characters" });
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Password is required" });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        request.Username = request.Username.Trim();

        var result = await _authService.Register(request);

        if (result == null)
            return BadRequest(new { message = "Account already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username and password are required" });

        var result = await _authService.Login(request);

        if (result == null)
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
            return BadRequest(new { message = "Username is required" });
        if (string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "New password is required" });
        if (request.NewPassword.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        var result = await _authService.ResetPassword(request.Username, request.NewPassword);

        if (result == null)
            return BadRequest(new { message = "Username not found" });

        return Ok(result);
    }
}
