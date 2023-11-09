using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
            ImageUrl = movie.ImageUrl,
            ShowTimeId = movie.ShowTimeId,
            Showtimes = movie.Showtimes.Select(x => new MovieShowtimeGetDto
            {
                Id = x.Id,
                StartTime = x.StartTime,
                TheaterID = x.TheaterID
            }).ToList()
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
            .Include(x => x.Showtimes)
            .Select(movie => new MovieGetDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Rating = movie.Rating,
                ReleaseDate = movie.ReleaseDate,
                Description = movie.Description,
                Genre = movie.Genre,
                Duration = movie.Duration,
                ImageUrl = movie.ImageUrl,
                ShowTimeId = movie.ShowTimeId,
                Showtimes = movie.Showtimes.Select(x => new MovieShowtimeGetDto
                {
                    Id = x.Id,
                    StartTime = x.StartTime,
                    TheaterID = x.TheaterID
                }).ToList()
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

        if (createDto.Rating < 1 || createDto.Rating > 5)
        {
            response.AddError("rating", "Rating must be between 1 and 5.");
        }


        if (createDto.ReleaseDate < DateTime.Now)
        {
            response.AddError("releasedate", "Release date must be in the future.");
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
            ImageUrl = createDto.ImageUrl,


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
            ImageUrl = movieToCreate.ImageUrl,
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

        if (updateDto.Rating < 1 || updateDto.Rating > 5)
        {
            response.AddError("rating", "Rating must be between 1 and 5.");
        }


        if (updateDto.ReleaseDate < DateTime.Now)
        {
            response.AddError("releasedate", "Release date must be in the future.");
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


