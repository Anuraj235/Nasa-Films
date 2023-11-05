using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace LearningStarter.Controllers;

[ApiController]
[RouteAttribute("api/screens")]
public class ScreensController : Controller
{
   
private readonly DataContext _dataContext;

    public ScreensController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
        .Set<Screen>()
        .Select(screen => new ScreenGetDto
        {
            Id = screen.Id,
            TotalCapacity = screen.TotalCapacity,
            TheaterId = screen.TheaterId,
        })
        .ToList();
        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<Screen>()
            .Select(screen => new ScreenGetDto
            {
                Id = screen.Id,
                TotalCapacity = screen.TotalCapacity,
                TheaterId = screen.TheaterId,
            })
            .FirstOrDefault(screen => screen.Id == id);


        response.Data = data;
        return Ok(response);


    }


    [HttpPost]
    public IActionResult Create([FromBody] ScreenCreateDto createDto)
    {
        var response = new Response();

        if (createDto.TotalCapacity < 0)
        {
            response.AddError("rating", "Total capacity must be greater that 0.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var screenToCreate = new Screen
        {
            TotalCapacity = createDto.TotalCapacity,
            TheaterId=createDto.TheaterId,
                   
           
            
        };

        _dataContext.Set<Screen>().Add(screenToCreate);
        _dataContext.SaveChanges();

        var screenToReturn = new ScreenGetDto
        {
            Id = screenToCreate.Id,
            TotalCapacity = screenToCreate.TotalCapacity,
               TheaterId= screenToCreate.TheaterId,
        };
        response.Data = screenToReturn;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ScreenUpdateDto updateDto, int id)
    {
        var response = new Response();



        if (updateDto.TotalCapacity < 0)
        {
            response.AddError("rating", "Total capacity must be greater than 0.");
        }

        var screenToUpdate = _dataContext.Set<Screen>()
            .FirstOrDefault(screen => screen.Id == id);

        if (screenToUpdate == null)
        {
            response.AddError("id", "Screens not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        screenToUpdate.TotalCapacity = updateDto.TotalCapacity;

        _dataContext.SaveChanges();

        var screenToReturn = new ScreenGetDto
        {
            Id = screenToUpdate.Id,
            TotalCapacity = screenToUpdate.TotalCapacity,
            TheaterId = screenToUpdate.TheaterId
          
        };

        response.Data = screenToReturn;
        return Ok(response);

    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var screenToDelete = _dataContext.Set<Screen>()
            .FirstOrDefault(screen => screen.Id == id);

        if (screenToDelete == null)
        {
            response.AddError("id", "Screens not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Screen>().Remove(screenToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }



}
