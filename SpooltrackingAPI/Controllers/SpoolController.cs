using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpooltrackingAPI.Database;
using SpooltrackingAPI.Helpers;
using SpooltrackingAPI.Models;
using SpooltrackingAPI.Models.ApiRequestModels;

namespace SpooltrackingAPI.Controllers;

[ApiController]
[Route("/api/spool")]
public class SpoolController : ControllerBase
{
    private readonly SpoolDbContext _context;
    private ILogger<SpoolController> Logger { get; init; }

    public SpoolController(SpoolDbContext context, ILogger<SpoolController> logger)
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
    public ActionResult<IEnumerable<Spool>> GetAll()
    {
        this.Logger.LogInformation("SpoolController.GetAll - Get all spools");

        var allSpools = this._context.Spools.Include(s => s.Brand).ToArray();
        if (allSpools.Length == 0)
        {
            this.Logger.LogInformation("No spools found in DB");
            return this.NoContent();
        }

        return this.Ok(allSpools);
    }

    [HttpGet]
    [Route("byId/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<Spool> GetById(Guid id)
    {
        this.Logger.LogInformation("SpoolController.GetById - Get spool with id {id}", id);

        var spool = this._context.Spools.SingleOrDefault(spool => spool.Id == id);
        if (spool is null)
        {
            this.Logger.LogWarning("No spool with id: {id} found", id);
            return this.NotFound();
        }

        return this.Ok(spool);
    }

    [HttpGet]
    [Route("byColor/{color}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Spool>> GetByColor(string color)
    {
        this.Logger.LogInformation("SpoolController.GetByColor - Get spools with color {color}", color);

        var spools = this._context.Spools
            .Where(spool => !string.IsNullOrEmpty(spool.Color) && spool.Color.Equals(color, StringComparison.OrdinalIgnoreCase))
            .ToArray();

        if (spools.Length == 0)
        {
            this.Logger.LogInformation("No spools found with color: {color}", color);
            return this.NoContent();
        }

        return this.Ok(spools);
    }

    [HttpGet]
    [Route("byMaterial/{material}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Spool>> GetByMaterial(string material)
    {
        this.Logger.LogInformation("SpoolController.GetByMaterial - Get spools with material {material}", material);

        var spools = this._context.Spools
            .Where(spool => !string.IsNullOrEmpty(spool.Material) && spool.Material.Equals(material, StringComparison.OrdinalIgnoreCase))
            .ToArray();

        if (spools.Length == 0)
        {
            this.Logger.LogInformation("No spools found with material: {material}", material);
            return this.NoContent();
        }

        return this.Ok(spools);
    }

    [HttpGet]
    [Route("byBrandName/{name}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Spool>> GetByBrandName(string name)
    {
        this.Logger.LogInformation("SpoolController.GetByBrandName - Get spools with brand name {brandName}", name);

        var spools = this._context.Spools
            .Where(spool => spool.Brand != null 
                && !string.IsNullOrEmpty(spool.Brand.Name) 
                && spool.Brand.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
            .ToArray();

        if (spools.Length == 0)
        {
            this.Logger.LogInformation("No spools found with brand name: {material}", name);
            return this.NoContent();
        }

        return this.Ok(spools);
    }

    [HttpPost]
    [Route("update")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult UpdateSpool(UpdateSpoolModel updateModel)
    {
        var spool = this._context.Spools.SingleOrDefault(spool => spool.Id == updateModel.Id);

        if (spool is null)
        {
            this.Logger.LogWarning("No spool with id: {id} found", updateModel.Id);
            return this.NotFound();
        }

        spool.BrandId = updateModel.BrandId ?? spool.BrandId;
        spool.Color = updateModel.Color ?? spool.Color;
        spool.Material = updateModel.Material ?? spool.Material;
        spool.Weight = updateModel.Weight ?? spool.Weight;

        this._context.Update(spool);
        try
        {
            this._context.SaveChanges();
            return this.Ok();
        }
        catch (Exception ex)
        {
            this.Logger.LogError("An error occured during saving to the db: {ex}", ex);
            return this.StatusCode(500);
        }
    }

    [HttpPost]
    [Route("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult CreateSpool(CreateSpoolModel createModel)
    {
        this._context.Add(SpoolFactory.Create(createModel.BrandId, createModel.Color, createModel.Material, createModel.Weight));
        try
        {
            this._context.SaveChanges();
            return this.Ok();
        }
        catch (Exception ex)
        {
            this.Logger.LogError("An error occured during saving to the db: {ex}", ex);
            return this.StatusCode(500);
        }
    }
    
    [HttpPost]
    [Route("delete")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult DeleteSpool(Guid id)
    {
        var spool = this._context.Spools.SingleOrDefault(spool => spool.Id == id);

        if (spool is null)
        {
            this.Logger.LogWarning("No spool with id: {id} found", id);
            return this.NotFound();
        }

        this._context.Remove(spool);

        try
        {
            this._context.SaveChanges();
            return this.Ok();
        }
        catch (Exception ex)
        {
            this.Logger.LogError("An error occured during saving to the db: {ex}", ex);
            return this.StatusCode(500);
        }
    }
    

}