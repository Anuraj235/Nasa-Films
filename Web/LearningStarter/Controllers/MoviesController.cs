using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace LearningStarter.Controllers;


[ApiController]
[RouteAttribute("api/movies")]

public class MoviesController : ControllerBase

{
    private readonly DataContext _dataContext;

    public MoviesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
        .Set<Movie>()
        .Select(movie => new MovieGetDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Rating = movie.Rating,
            ReleaseDate = movie.ReleaseDate,
            Description = movie.Description,
            Genre = movie.Genre,
            Duration = movie.Duration,
            ShowTimeId = movie.ShowTimeId
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
            .Set<Movie>()
            .Select(movie => new MovieGetDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Rating = movie.Rating,
                ReleaseDate = movie.ReleaseDate,
                Description = movie.Description,
                Genre = movie.Genre,
                Duration = movie.Duration,
                ShowTimeId= movie.ShowTimeId,
            })
            .FirstOrDefault(movie => movie.Id == id);


        response.Data = data;
        return Ok(response);


    }


    [HttpPost]
    public IActionResult Create([FromBody] MovieCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Title))
        {
            response.AddError("title", "Title cannot be empty.");
        }

        if (createDto.Rating < 0) 
            {
            response.AddError("rating", "Rating must be in between 1 to 5.");
        }

        if (createDto.ReleaseDate < 0)
        {
            response.AddError("releasedate", "Date must be positive.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var movieToCreate = new Movie
        {
            Title = createDto.Title,
            Rating = createDto.Rating,
            ReleaseDate = createDto.ReleaseDate,
            Description = createDto.Description,
            Genre = createDto.Genre,
            Duration = createDto.Duration,
       
        };

        _dataContext.Set<Movie>().Add(movieToCreate);
        _dataContext.SaveChanges();

        var moiveToReturn = new MovieGetDto
        {
            Id = movieToCreate.Id,
            Title = movieToCreate.Title,
            Rating = movieToCreate.Rating,
            ReleaseDate = movieToCreate.ReleaseDate,
            Description = movieToCreate.Description,
            Genre = movieToCreate.Genre,
            Duration = movieToCreate.Duration,
            ShowTimeId = movieToCreate.ShowTimeId,
        };
        response.Data = moiveToReturn;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] MovieUpdateDto updateDto, int id)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(updateDto.Title))
        {
            response.AddError("title", "Title cannot be empty.");
        }

        if (updateDto.Rating < 0)
        {
            response.AddError("rating", "Rating must be in between 1 to 5.");
        }

        if (updateDto.ReleaseDate < 0)
        {
            response.AddError("releasedate", "Date must be positive.");
        }


        var movieToUpdate = _dataContext.Set<Movie>()
            .FirstOrDefault(movie => movie.Id == id);

        if (movieToUpdate == null)
        {
            response.AddError("id", "Movies not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        movieToUpdate.Title = updateDto.Title;
        movieToUpdate.Rating = updateDto.Rating;
        movieToUpdate.ReleaseDate = updateDto.ReleaseDate;
        movieToUpdate.Description = updateDto.Description;
        movieToUpdate.Genre = updateDto.Genre;
        movieToUpdate.Duration = updateDto.Duration;
      

        _dataContext.SaveChanges();

        var movieToReturn = new MovieGetDto
        {
            Id = movieToUpdate.Id,
            Title = movieToUpdate.Title,
            Rating = movieToUpdate.Rating,
            ReleaseDate = movieToUpdate.ReleaseDate,
            Description = movieToUpdate.Description,
            Genre = movieToUpdate.Genre,
            Duration = movieToUpdate.Duration,
            ShowTimeId = movieToUpdate.ShowTimeId
        };

        response.Data = movieToReturn;
        return Ok(response);

    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var movieToDelete = _dataContext.Set<Movie>()
            .FirstOrDefault(movie => movie.Id == id);

        if (movieToDelete == null)
        {
            response.AddError("id", "Movies not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Movie>().Remove(movieToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }



}


