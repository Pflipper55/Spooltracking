# SpooltrackingAPI — local dev & database setup

This file documents the minimal steps to run the database and EF Core migrations for local development.

Key points
- The project expects a SQL Server instance reachable at the connection string in `ConnectionStrings:DefaultConnection`.
- By default the project falls back to an environment variable `SPOOL_DB_CONN` if present, or the connection string in `appsettings.json`.

Recommended local setup

1. Start a SQL Server 2019 container (example):

```bash
# Start SQL Server 2019 on localhost:1433 (change password)
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Your_password123" -p 1433:1433 --name spoolsql -d mcr.microsoft.com/mssql/server:2019-latest
```

2. Configure connection string
- Edit `appsettings.Development.json` or set the env var `SPOOL_DB_CONN` before running the app. Example connection string:

```
Server=localhost,1433;Database=SpooltrackingDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;
```

3. Install EF tools (if not already available) and create the initial migration

```bash
cd SpooltrackingAPI
dotnet add package Microsoft.EntityFrameworkCore.Design
# If dotnet ef is not available, install it: dotnet tool install --global dotnet-ef
dotnet ef migrations add Initial --context SpoolDbContext --output-dir Database/Migrations
dotnet ef database update --context SpoolDbContext
```

Notes
- The `SpoolDbContext` will also use the `SPOOL_DB_CONN` environment variable if present.
- If you prefer to keep credentials out of files, set the env var in your shell or Docker compose.

Troubleshooting
- If `dotnet ef` fails, ensure the `Microsoft.EntityFrameworkCore.Design` package is referenced in the project and that the `dotnet-ef` tool is installed.
