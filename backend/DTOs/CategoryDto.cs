namespace FinTrack.Api.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "expense"; // income or expense
    public string Color { get; set; } = "#6366f1";
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "expense";
    public string Color { get; set; } = "#6366f1";
}

public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "expense";
    public string Color { get; set; } = "#6366f1";
}
