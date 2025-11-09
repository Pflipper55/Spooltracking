namespace SpooltrackingAPI.Models.ApiRequestModels;

public sealed class UpdateSpoolModel
{
    public Guid Id { get; set; }

    public Guid? BrandId { get; set; }

    public string? Color { get; set; }

    public string? Material { get; set; }

    public double? Weight { get; set; }
}