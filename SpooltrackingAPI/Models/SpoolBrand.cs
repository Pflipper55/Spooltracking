namespace SpooltrackingAPI.Models;

public class SpoolBrand
{
    public Guid Id { get; init; }

    // Nullable to match initialization patterns and avoid CS8618 warnings.
    public string? Name { get; set; }
}