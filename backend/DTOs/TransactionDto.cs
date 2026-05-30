namespace FinTrack.Api.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "expense"; // income or expense
    public decimal Amount { get; set; }
    public Guid AccountId { get; set; }
    public string AccountName { get; set; } = string.Empty; // from Account nav property
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty; // from Category nav property
    public string CategoryColor { get; set; } = "#6366f1"; // from Category nav property
    public string Note { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class CreateTransactionDto
{
    public string Type { get; set; } = "expense";
    public decimal Amount { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class UpdateTransactionDto
{
    public string Type { get; set; } = "expense";
    public decimal Amount { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}
