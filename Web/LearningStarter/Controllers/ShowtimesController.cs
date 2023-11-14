using System;
using System.Linq;
using System.Net.Http.Headers;
using LearningStarter.Common;
using LearningStarter.Data;

using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/showtimes")]
public class ShowtimesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ShowtimesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<Showtimes>()
            .Select(showtimes => new ShowtimesGetDto
            {
                Id = showtimes.Id,
                MovieId = showtimes.MovieId,
                StartTime = showtimes.StartTime,
                TheaterID = showtimes.TheaterID,
                AvailableSeats = showtimes.AvailableSeats,
                Bookings = showtimes.Bookings.Select(x => new ShowtimeBookingGetDto
                {
                    Id = x.Booking.ID,
                    NumberofTickets = x.Booking.NumberofTickets,
                    BookingDate = x.Booking.BookingDate,
                    TenderAmount = x.Booking.TenderAmount,
                }).ToList(),

                Movie = new ShowtimeMovieGetDto
                {
                    Id = showtimes.Movie.Id,
                    Title = showtimes.Movie.Title,
                    Duration = showtimes.Movie.Duration,
                    Genre = showtimes.Movie.Genre,
                    Rating = showtimes.Movie.Rating,
                    Description = showtimes.Movie.Description,
                    ReleaseDate = showtimes.Movie.ReleaseDate,
                }


            }).ToList();

        response.Data = data;

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext


              .Set<Showtimes>()
              .Include(x => x.Movie)
              .Select(showtimes => new ShowtimesGetDto
              {
                  Id = showtimes.Id,
                  MovieId = showtimes.MovieId,
                  StartTime = showtimes.StartTime,
                  TheaterID = showtimes.TheaterID,
                  AvailableSeats = showtimes.AvailableSeats,
                  Bookings = showtimes.Bookings.Select(x => new ShowtimeBookingGetDto

                  {
                      Id = x.Booking.ID,
                      NumberofTickets = x.Booking.NumberofTickets,
                      BookingDate = x.Booking.BookingDate,
                      TenderAmount = x.Booking.TenderAmount,
                  }).ToList(),
                  Movie = new ShowtimeMovieGetDto
                  {
                      Id = showtimes.Movie.Id,
                      Title = showtimes.Movie.Title,
                      Duration = showtimes.Movie.Duration,
                      Genre = showtimes.Movie.Genre,
                      Rating = showtimes.Movie.Rating,
                      Description = showtimes.Movie.Description,
                      ReleaseDate = showtimes.Movie.ReleaseDate,
                  }

              }).ToList();


        response.Data = data;
        return Ok(data);

    }


    [HttpPost]
    public IActionResult Create([FromBody] ShowtimesCreateDto createDto)
    {
        var response = new Response();

        if (createDto.AvailableSeats < 0)
        {
            response.AddError(nameof(createDto.AvailableSeats), "AvailableSeats must be positive");
        }


        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        var showtimeToCreate = new Showtimes
        {
            MovieId = createDto.MovieId,
            StartTime = createDto.StartTime,
            TheaterID = createDto.TheaterID,
            AvailableSeats = createDto.AvailableSeats

        };

        _dataContext.Set<Showtimes>().Add(showtimeToCreate);
        _dataContext.SaveChanges();

        var showtimeToReturn = new ShowtimesGetDto
        {
            Id = showtimeToCreate.Id,
            MovieId = showtimeToCreate.MovieId,
            StartTime = showtimeToCreate.StartTime,
            TheaterID = showtimeToCreate.TheaterID,
            AvailableSeats = showtimeToCreate.AvailableSeats,
        };

        response.Data = showtimeToReturn;

        return Created("", response);

    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ShowtimesUpdateDto updateDto, int id)
    {
        var response = new Response();

        if (updateDto.AvailableSeats < 0)
        {
            response.AddError(nameof(updateDto.AvailableSeats), "AvailableSeats must be positive");
        }


        var showtimestoUpdate = _dataContext.Set<Showtimes>()
            .FirstOrDefault(showtimes => showtimes.Id == id);
        if (showtimestoUpdate == null)
        {
            response.AddError("id", "showtimes not found.");

        }
        if (response.HasErrors)
        {
            return BadRequest(response);

        }
        showtimestoUpdate.StartTime = updateDto.StartTime;
        showtimestoUpdate.TheaterID = updateDto.TheaterID;
        showtimestoUpdate.AvailableSeats = updateDto.AvailableSeats;

        _dataContext.SaveChanges();
        var showtimetoReturn = new ShowtimesGetDto
        {
            Id = showtimestoUpdate.Id,
            MovieId = showtimestoUpdate.MovieId,
            StartTime = showtimestoUpdate.StartTime,
            TheaterID = showtimestoUpdate.TheaterID,

        };
        response.Data = showtimetoReturn;
        return Ok(response);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var showtimestoDelete = _dataContext.Set<Showtimes>()
            .FirstOrDefault(showtimes => showtimes.Id == id);
        if (showtimestoDelete == null)
        {
            response.AddError("id", "showtimes not found.");

        }
        if (response.HasErrors)
        {
            return BadRequest(response);

        }
        _dataContext.Set<Showtimes>().Remove(showtimestoDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);

    }


}
