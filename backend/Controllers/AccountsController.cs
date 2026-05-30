using Microsoft.AspNetCore.Mvc;
using FinTrack.Api.DTOs;
using FinTrack.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class AccountsController     : ControllerBase
{
    private readonly IAccountService _accountService;

public AccountsController  (IAccountService accountService)
{
    _accountService = accountService;
}


[HttpGet]
public async Task<IActionResult> GetAll()
    {
    var userId = Guid.Parse(User.FindFirst("userId")!.Value);
    var result = await _accountService.GetAll(userId);
    return Ok(result);    }


[HttpPost]
public async Task<IActionResult> Create(CreateAccountDto dto)
    {
    if (string.IsNullOrWhiteSpace(dto.Name))
        return BadRequest(new { message = "Account name is required" });
    if (dto.Name.Length > 100)
        return BadRequest(new { message = "Account name must be 100 characters or less" });

    string[] validTypes = ["bank", "cash", "wallet"];
    if (!validTypes.Contains(dto.Type))
        return BadRequest(new { message = "Account type must be bank, cash, or wallet" });

    if (dto.Balance < 0)
        return BadRequest(new { message = "Initial balance cannot be negative" });

    dto.Name = dto.Name.Trim();

    var userId = Guid.Parse(User.FindFirst("userId")!.Value);
    var result = await _accountService.Create(userId, dto);
    return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateAccountDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Account name is required" });
        if (dto.Name.Length > 100)
            return BadRequest(new { message = "Account name must be 100 characters or less" });

        string[] validTypes = ["bank", "cash", "wallet"];
        if (!validTypes.Contains(dto.Type))
            return BadRequest(new { message = "Account type must be bank, cash, or wallet" });

        if (dto.Balance < 0)
            return BadRequest(new { message = "Balance cannot be negative" });

        dto.Name = dto.Name.Trim();

        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _accountService.Update(userId, id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _accountService.Delete(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}