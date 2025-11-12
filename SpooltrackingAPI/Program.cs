using System;
using Microsoft.EntityFrameworkCore;
using SpooltrackingAPI.Database;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext. Prefer SPOOL_DB_CONN environment variable (set by the container entrypoint),
// otherwise fall back to ConnectionStrings:DefaultConnection from configuration.
var connectionString = Environment.GetEnvironmentVariable("SPOOL_DB_CONN")
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<SpoolDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString))
    {
        options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure());
    }
    // If no connection is provided here, SpoolDbContext.OnConfiguring will provide a fallback.
});

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Apply EF Core migrations at startup (code-based automatic migrations) with retry/wait logic
using (var scope = app.Services.CreateScope())
{
    // Use the scoped provider for resolving services like DbContext and ILogger
    var provider = scope.ServiceProvider;
    var logger = provider.GetRequiredService<ILogger<Program>>();

    var db = provider.GetRequiredService<SpoolDbContext>();

    const int maxAttempts = 8; // total attempts
    var attempt = 0;
    var delayMs = 2000; // initial backoff 2s

    logger.LogInformation("Starting database migration with up to {MaxAttempts} attempts...", maxAttempts);
    logger.LogInformation(connectionString);
    while (true)
    {
        try
        {
            attempt++;
            logger.LogInformation("Migration attempt {Attempt}...", attempt);
            db.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully on attempt {Attempt}.", attempt);
            break;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Database migration attempt {Attempt} failed.", attempt);
            if (attempt >= maxAttempts)
            {
                logger.LogError(ex, "All {MaxAttempts} database migration attempts failed. Aborting startup.", maxAttempts);
                throw; // fail fast after exhausting retries
            }

            logger.LogInformation("Waiting {DelayMs}ms before next migration attempt...", delayMs);
            System.Threading.Thread.Sleep(delayMs);
            // exponential backoff with cap
            delayMs = Math.Min(delayMs * 2, 30000);
        }
    }
}

app.Run();
