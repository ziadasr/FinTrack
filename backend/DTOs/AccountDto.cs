namespace FinTrack.Api.DTOs;

public class AccountDto
{
    public Guid Id { get; set; } //Global unique identifier 
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "bank";
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAccountDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "bank";
    public decimal Balance { get; set; }
}

public class UpdateAccountDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "bank";
    public decimal Balance { get; set; } // same as float no rounding errors
}
