using Microsoft.AspNetCore.Mvc;
using SpooltrackingAPI.Database;
using SpooltrackingAPI.Helpers;
using SpooltrackingAPI.Models;

namespace SpooltrackingAPI.Controllers;

[ApiController]
[Route("/api/spoolbrand")]
public class SpoolBrandController : ControllerBase
{
    private readonly SpoolDbContext _context;
    private ILogger<SpoolBrandController> Logger { get; init; }

    public SpoolBrandController(SpoolDbContext context, ILogger<SpoolBrandController> logger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(logger);

        this._context = context;
        this.Logger = logger;
    }

    [HttpGet]
    [Route("all")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<SpoolBrand>> GetAll()
    {
        this.Logger.LogInformation("SpoolBrandController.GetAll - Get all spool brands");

        var all = this._context.SpoolBrands.ToArray();
        if (all.Length == 0)
        {
            this.Logger.LogInformation("No spool brands found in DB");
            return this.NoContent();
        }

        return this.Ok(all);
    }

    [HttpGet]
    [Route("byName/{name}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<SpoolBrand> GetByName(string name)
    {
        this.Logger.LogInformation("SpoolBrandController.GetByName - Get brand with name {name}", name);

        var brand = this._context.SpoolBrands.SingleOrDefault(b => !string.IsNullOrEmpty(b.Name) && b.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        if (brand is null)
        {
            this.Logger.LogWarning("No spool brand with name: {name} found", name);
            return this.NotFound();
        }

        return this.Ok(brand);
    }

    [HttpPost]
    [Route("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public ActionResult CreateBrand(CreateSpoolBrandModel model)
    {
        var doesAlreadyExists = this._context.SpoolBrands.SingleOrDefault(b => b.Name == model.Name) is not null;
        if(doesAlreadyExists)
        {
            this.Logger.LogWarning("Spool brand with name: {name} already exists", model.Name);
            return this.Conflict($"Spool brand with name '{model.Name}' already exists.");
        }

        var entity = SpoolBrandFactory.Create(model.Name);
        this._context.Add(entity);
        try
        {
            this._context.SaveChanges();
            return this.Ok(entity);
        }
        catch (Exception ex)
        {
            this.Logger.LogError(ex, "An error occured during saving a spool brand to the db");
            return this.StatusCode(500);
        }
    }

    [HttpPost]
    [Route("update")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult UpdateBrand(UpdateSpoolBrandModel model)
    {
        var brand = this._context.SpoolBrands.SingleOrDefault(b => b.Id == model.Id);
        if (brand is null)
        {
            this.Logger.LogWarning("No spool brand with id: {id} found", model.Id);
            return this.NotFound();
        }

        var doesAlreadyExists = brand.Name == model.Name;
        if(doesAlreadyExists)
        {
            this.Logger.LogWarning("Spool brand with name: {name} already exists", model.Name);
            return this.Conflict($"Spool brand with name '{model.Name}' already exists.");
        }

        brand.Name = model.Name ?? brand.Name;

        this._context.Update(brand);
        try
        {
            this._context.SaveChanges();
            return this.Ok(brand);
        }
        catch (Exception ex)
        {
            this.Logger.LogError(ex, "An error occured during saving a spool brand to the db");
            return this.StatusCode(500);
        }
    }

    [HttpPost]
    [Route("delete")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult DeleteBrand(Guid id)
    {
        var brand = this._context.SpoolBrands.SingleOrDefault(b => b.Id == id);
        if (brand is null)
        {
            this.Logger.LogWarning("No spool brand with id: {id} found", id);
            return this.NotFound();
        }

        this._context.Remove(brand);
        try
        {
            this._context.SaveChanges();
            return this.Ok();
        }
        catch (Exception ex)
        {
            this.Logger.LogError(ex, "An error occured during deleting a spool brand from the db");
            return this.StatusCode(500);
        }
    }
}
