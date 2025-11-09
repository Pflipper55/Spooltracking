namespace SpooltrackingAPI.Models;

public class Spool
{
    public Guid Id { get; init; }
    public Guid BrandId { get; set; }
    // Navigation property can be null when tracking only the FK or during materialization
    public SpoolBrand? Brand { get; set; }
    // Nullable strings to avoid CS8618 warnings for POCOs that are constructed by serializers/EF
    public string? Material { get; set; }
    public string? Color { get; set; }
    public double Weight { get; set; }
}