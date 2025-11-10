using System;
using SpooltrackingAPI.Models;

namespace SpooltrackingAPI.Helpers;

public static class SpoolBrandFactory
{
    public static SpoolBrand Create(string? name)
    {
        return new SpoolBrand()
        {
            Id = Guid.NewGuid(),
            Name = name
        };
    }
}
