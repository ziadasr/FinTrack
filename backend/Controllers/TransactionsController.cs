using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FinTrack.Api.DTOs;
using FinTrack.Api.Services;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _transactionService.GetAll(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTransactionDto dto)
    {
        if (dto.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than zero" });

        string[] validTypes = ["income", "expense"];
        if (!validTypes.Contains(dto.Type))
            return BadRequest(new { message = "Transaction type must be income or expense" });

        if (dto.Note.Length > 500)
            return BadRequest(new { message = "Note must be 500 characters or less" });

        dto.Note = dto.Note.Trim();

        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var (data, error) = await _transactionService.Create(userId, dto);
        if (error != null) return BadRequest(new { message = error });
        return Ok(data);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateTransactionDto dto)
    {
        if (dto.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than zero" });

        string[] validTypes = ["income", "expense"];
        if (!validTypes.Contains(dto.Type))
            return BadRequest(new { message = "Transaction type must be income or expense" });

        if (dto.Note.Length > 500)
            return BadRequest(new { message = "Note must be 500 characters or less" });

        dto.Note = dto.Note.Trim();

        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var (data, error) = await _transactionService.Update(userId, id, dto);
        if (error != null) return BadRequest(new { message = error });
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _transactionService.Delete(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}
