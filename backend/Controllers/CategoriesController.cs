using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FinTrack.Api.DTOs;
using FinTrack.Api.Services;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = Guid.Parse(User.FindFirst("userId")!.Value); // extract the user id from the token and then call the service 
        var result = await _categoryService.GetAll(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Category name is required" });
        if (dto.Name.Length > 100)
            return BadRequest(new { message = "Category name must be 100 characters or less" });

        string[] validTypes = ["income", "expense"];
        if (!validTypes.Contains(dto.Type))
            return BadRequest(new { message = "Category type must be income or expense" });

        dto.Name = dto.Name.Trim();

        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _categoryService.Create(userId, dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Category name is required" });
        if (dto.Name.Length > 100)
            return BadRequest(new { message = "Category name must be 100 characters or less" });

        string[] validTypes = ["income", "expense"];
        if (!validTypes.Contains(dto.Type))
            return BadRequest(new { message = "Category type must be income or expense" });

        dto.Name = dto.Name.Trim();

        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _categoryService.Update(userId, id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst("userId")!.Value);
        var result = await _categoryService.Delete(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}
