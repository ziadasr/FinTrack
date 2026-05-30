using Microsoft.EntityFrameworkCore;
using FinTrack.Api.Data;
using FinTrack.Api.DTOs;
using FinTrack.Api.Models;
namespace FinTrack.Api.Services;

public interface ITransactionService
{
    Task<List<TransactionDto>> GetAll(Guid userId);
    Task<(TransactionDto? Data, string? Error)> Create(Guid userId, CreateTransactionDto dto);
    Task<(TransactionDto? Data, string? Error)> Update(Guid userId, Guid id, UpdateTransactionDto dto);
    Task<bool> Delete(Guid userId, Guid id);
}
public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<List<TransactionDto>> GetAll(Guid userId)
{
    return await _context.Transactions
        .Include(t => t.Account)
        .Include(t => t.Category)
        .Where(t => t.UserId == userId)
        .Select(t => new TransactionDto
        {
            Id = t.Id,
            Type = t.Type,
            Amount = t.Amount,
            AccountId = t.AccountId,
            AccountName = t.Account.Name,
            CategoryId = t.CategoryId,
            CategoryName = t.Category.Name,
            CategoryColor = t.Category.Color,
            Note = t.Note,
            Date = t.Date
        })
        .ToListAsync();
}
   public async Task<(TransactionDto? Data, string? Error)> Create(Guid userId, CreateTransactionDto dto)
    {
        var account = await _context.Accounts
         .FirstOrDefaultAsync(a => a.Id == dto.AccountId && a.UserId == userId);
        if (account == null) return (null, "Invalid account");

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == dto.CategoryId && c.UserId == userId);
        if (category == null) return (null, "Invalid category");

        if (dto.Type == "expense" && dto.Amount > account.Balance)
            return (null, "Insufficient balance");

        if (dto.Type == "income")
            account.Balance += dto.Amount;
        else
            account.Balance -= dto.Amount;

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Type = dto.Type,
            Amount = dto.Amount,
            AccountId = dto.AccountId,
            CategoryId = dto.CategoryId,
            Note = dto.Note,
            Date = dto.Date,
            UserId = userId
        };
        _context.Add(transaction);
        await _context.SaveChangesAsync();

        return (new TransactionDto
        {
            Id = transaction.Id,
            Type = transaction.Type,
            Amount = transaction.Amount,
            AccountId = transaction.AccountId,
            AccountName = account.Name,
            CategoryId = transaction.CategoryId,
            CategoryName = category.Name,
            CategoryColor = category.Color,
            Note = transaction.Note,
            Date = transaction.Date
        }, null);
    }
   public async Task<(TransactionDto? Data, string? Error)> Update(Guid userId, Guid id, UpdateTransactionDto dto)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (transaction == null) return (null, "Transaction not found");

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == transaction.AccountId);
        if (account == null) return (null, "Invalid account");

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == dto.CategoryId && c.UserId == userId);
        if (category == null) return (null, "Invalid category");

        var simulatedBalance = account.Balance;
        if (transaction.Type == "income")
            simulatedBalance -= transaction.Amount;
        else
            simulatedBalance += transaction.Amount;

        if (dto.Type == "expense" && dto.Amount > simulatedBalance)
            return (null, "Insufficient balance");

        account.Balance = simulatedBalance;
        if (dto.Type == "income")
            account.Balance += dto.Amount;
        else
            account.Balance -= dto.Amount;

        transaction.Type = dto.Type;
        transaction.Amount = dto.Amount;
        transaction.AccountId = dto.AccountId;
        transaction.CategoryId = dto.CategoryId;
        transaction.Note = dto.Note;
        transaction.Date = dto.Date;

        await _context.SaveChangesAsync();

        return (new TransactionDto
        {
            Id = transaction.Id,
            Type = transaction.Type,
            Amount = transaction.Amount,
            AccountId = transaction.AccountId,
            AccountName = account.Name,
            CategoryId = transaction.CategoryId,
            CategoryName = category.Name,
            CategoryColor = category.Color,
            Note = transaction.Note,
            Date = transaction.Date
        }, null);
    }

    public async Task<bool> Delete(Guid userId, Guid id)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null) return false;

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == transaction.AccountId);

        if (account != null)
        {
            if (transaction.Type == "income")
                account.Balance -= transaction.Amount;
            else
                account.Balance += transaction.Amount;
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return true;
    }
}

