using SpooltrackingAPI.Models;

namespace SpooltrackingAPI.Helpers;

public static class SpoolFactory
{
    public static Spool Create(Guid brandId, string? color, string? material, double weight)
    {
        return new Spool()
        {
            Id = Guid.NewGuid(),
            BrandId = brandId,
            Color = color,
            Material = material,
            Weight = weight
        };
    }
}