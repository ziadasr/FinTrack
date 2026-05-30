namespace FinTrack.Api.Models;

public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "expense"; // income, expense
    public string Color { get; set; } = "#6366f1";
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
