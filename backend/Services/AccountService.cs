using Microsoft.EntityFrameworkCore;
using FinTrack.Api.Data;
using FinTrack.Api.DTOs;
using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface IAccountService
{
    Task<List<AccountDto>> GetAll(Guid userId);
    Task<AccountDto> Create(Guid userId, CreateAccountDto dto);
    Task<AccountDto?> Update(Guid userId, Guid id, UpdateAccountDto dto);
    Task<bool> Delete(Guid userId, Guid id);
}

public class AccountService : IAccountService
{
    private readonly AppDbContext _context;
    public AccountService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AccountDto>> GetAll(Guid userId)
    {
        return await _context.Accounts
            .Where(a => a.UserId == userId)
            .Select(a => new AccountDto
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                Balance = a.Balance,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<AccountDto> Create(Guid userId, CreateAccountDto dto)
    {
        var account = new Account
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type,
            Balance = dto.Balance,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        return new AccountDto
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            CreatedAt = account.CreatedAt
        };
    }

    public async Task<AccountDto?> Update(Guid userId, Guid id, UpdateAccountDto dto)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (account == null) return null;

        account.Name = dto.Name;
        account.Type = dto.Type;
        account.Balance = dto.Balance;

        await _context.SaveChangesAsync();

        return new AccountDto
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            CreatedAt = account.CreatedAt
        };
    }

    public async Task<bool> Delete(Guid userId, Guid id)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (account == null) return false;

        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync();

        return true;
    }
}
