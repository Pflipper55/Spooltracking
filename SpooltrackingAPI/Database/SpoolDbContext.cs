using System;
using Microsoft.EntityFrameworkCore;
using SpooltrackingAPI.Models;

namespace SpooltrackingAPI.Database;

public class SpoolDbContext : DbContext
{
	public SpoolDbContext(DbContextOptions<SpoolDbContext> options) : base(options)
	{
	}

	public DbSet<Spool> Spools { get; set; }
	public DbSet<SpoolBrand> SpoolBrands { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// SpoolBrand configuration
		modelBuilder.Entity<SpoolBrand>(b =>
		{
			b.ToTable("SpoolBrands");
			b.HasKey(x => x.Id);
			b.Property(x => x.Name).IsRequired().HasMaxLength(100);
		});

		// Spool configuration
		modelBuilder.Entity<Spool>(s =>
		{
			s.ToTable("Spools");
			s.HasKey(x => x.Id);
			s.Property(x => x.Material).HasMaxLength(100);
			s.Property(x => x.Color).HasMaxLength(50);
			// Stored as SQL float (maps to C# double)
			s.Property(x => x.Weight).HasColumnType("float");

			s.HasOne(x => x.Brand)
				.WithMany()
				.HasForeignKey(x => x.BrandId)
				.OnDelete(DeleteBehavior.Restrict)
				.IsRequired();
		});
	}
}

