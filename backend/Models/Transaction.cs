namespace FinTrack.Api.Models;

public class Transaction
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "expense"; // income, expense
    public decimal Amount { get; set; }
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string Note { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
