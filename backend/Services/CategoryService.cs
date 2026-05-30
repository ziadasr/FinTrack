using Microsoft.EntityFrameworkCore;
using FinTrack.Api.Data;
using FinTrack.Api.DTOs;
using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAll(Guid userId);
    Task<CategoryDto> Create(Guid userId, CreateCategoryDto dto);
    Task<CategoryDto?> Update(Guid userId, Guid id, UpdateCategoryDto dto);
    Task<bool> Delete(Guid userId, Guid id);
}

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAll(Guid userId)
    {
        return await _context.Categories
            .Where(c => c.UserId == userId)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Type = c.Type,
                Color = c.Color
            })
            .ToListAsync();
    }

    public async Task<CategoryDto> Create(Guid userId, CreateCategoryDto dto)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type,
            Color = dto.Color,
            UserId = userId
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            Color = category.Color
        };
    }

    public async Task<CategoryDto?> Update(Guid userId, Guid id, UpdateCategoryDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null) return null;

        category.Name = dto.Name;
        category.Type = dto.Type;
        category.Color = dto.Color;

        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            Color = category.Color
        };
    }

    public async Task<bool> Delete(Guid userId, Guid id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null) return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }
}
