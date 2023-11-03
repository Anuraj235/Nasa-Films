using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/Theaters")]
    public class TheatersController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public TheatersController(DataContext dataConText)
        {
            _dataContext = dataConText;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var response = new Response();

            var data = _dataContext
                .Set<Theaters>()
                .Select(Theaters => new TheaterGetDto
                {
                    Id = Theaters.Id,
                    TheaterName = Theaters.TheaterName,
                    Address = Theaters.Address,
                    HallNumbers = Theaters.HallNumbers,
                    Email = Theaters.Email,
                    Phone = Theaters.Phone,
                    Reviews = Theaters.Reviews.Select(x => new TheaterReviewGetDto
                    {
                        Id = x.Id,
                        TheaterReview = x.TheaterReview,
                        Rating = x.Rating,
                        UserId = x.User.Id
                    }).ToList(),

                    Screens = Theaters.Screens.Select(x => new ScreenGetDto
                    {
                        Id = x.Id,
                        TotalCapacity = x.TotalCapacity,
                        TheaterId = x.TheaterId,
                     

                    }).ToList(),

                    Showtimes = Theaters.Showtimes.Select(x=> new TheaterShowtimeGetDto
                    {
                        Id=x.Id,
                        StartTime = x.StartTime,    
                        AvailableSeats = x.AvailableSeats,
                        MovieId = x.MovieId,
                    }).ToList(),


                })
                .ToList();

            response.Data = data;

            return Ok(response);
        }

   
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var response = new Response();

            var Theater = _dataContext
                .Set<Theaters>()
                .Include(x => x.Reviews)
                .ThenInclude(x => x.User)
                .Include(x => x.Screens)
                .Include(x => x.Showtimes)
                .FirstOrDefault(Theaters => Theaters.Id == id);

            if (Theater == null)
            {
                response.AddError("id", "Theater not found");
                return NotFound(response);
            }

            var theaterToReturn = new TheaterGetDto
            {
                Id = Theater.Id,
                TheaterName = Theater.TheaterName,
                Address = Theater.Address,
                HallNumbers = Theater.HallNumbers,
                Email = Theater.Email,
                Phone = Theater.Phone,
                Reviews = Theater.Reviews.Select(x => new TheaterReviewGetDto
                {
                    Id = x.Id,
                    TheaterReview = x.TheaterReview,
                    Rating = x.Rating,
                    UserId = x.User.Id
                }).ToList(),

                Screens = Theater.Screens.Select(x => new ScreenGetDto
                {
                    Id = x.Id,                    
                    TotalCapacity = x.TotalCapacity,
                    TheaterId = x.TheaterId,

                }).ToList(),
                Showtimes = Theater.Showtimes.Select(x => new TheaterShowtimeGetDto
                {
                    Id = x.Id,
                    StartTime = x.StartTime,
                    AvailableSeats = x.AvailableSeats,
                    MovieId = x.MovieId,
                }).ToList(),

            };

            response.Data = theaterToReturn;

            return Ok(response);
        }

        [HttpPost]
        public IActionResult Create([FromBody]TheaterCreateDto createDto)
        {
            var response = new Response();

            if (string.IsNullOrEmpty(createDto.Address))
            {
                response.AddError("Address", "Address must not be empty.");
            }

            if (!IsValidPhoneNumber(createDto.Phone))
            {
                response.AddError("Phone", "Invalid phone number.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            var TheaterToCreate = new Theaters
            {
                TheaterName = createDto.TheaterName,
                Address = createDto.Address,
                HallNumbers = createDto.HallNumbers,
                Email = createDto.Email,
                Phone = createDto.Phone
            };
            _dataContext.Set<Theaters>().Add(TheaterToCreate);
            _dataContext.SaveChanges();

            var TheaterToReturn = new TheaterGetDto
            {
                Id = TheaterToCreate.Id,
                TheaterName = TheaterToCreate.TheaterName,
                Address = TheaterToCreate.Address,
                HallNumbers = TheaterToCreate.HallNumbers,
                Email = TheaterToCreate.Email,
                Phone = TheaterToCreate.Phone,
             
            };

            response.Data = TheaterToReturn;

            return Created("", response);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]TheaterUpdateDto updateDto)
        {
            var response = new Response();

            var TheaterToUpdate = _dataContext
                .Set<Theaters>()
                .FirstOrDefault(Theaters => Theaters.Id == id);

            if (TheaterToUpdate == null)
            {
                response.AddError("id", "Theater not found.");
            }

            if (!IsValidPhoneNumber(updateDto.Phone))
            {
                response.AddError("Phone", "Invalid phone number.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            TheaterToUpdate.TheaterName = updateDto.TheaterName;
            TheaterToUpdate.Address = updateDto.Address;
            TheaterToUpdate.Phone = updateDto.Phone;
            TheaterToUpdate.HallNumbers = updateDto.HallNumbers;
            TheaterToUpdate.Email = updateDto.Email;

            _dataContext.SaveChanges();

            var TheaterToReturn = new TheaterGetDto
            {
                Address = TheaterToUpdate.Address,
                TheaterName = TheaterToUpdate.TheaterName,
                Phone = TheaterToUpdate.Phone,
                HallNumbers = TheaterToUpdate.HallNumbers,
                Email = TheaterToUpdate.Email,                
            };

            response.Data = TheaterToReturn;
            return Ok(response);
        }

  
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var response = new Response();

            var TheaterToDelete = _dataContext
                .Set<Theaters>()
                .FirstOrDefault(Theaters => Theaters.Id == id);

            if (TheaterToDelete == null)
            {
                response.AddError("id", "Theater not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            _dataContext.Set<Theaters>().Remove(TheaterToDelete);
            _dataContext.SaveChanges();

            response.Data = true;
            return Ok(response);
        }

        static bool IsValidPhoneNumber(string phoneNumber)
        {
            string pattern = @"^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$";

            return Regex.IsMatch(phoneNumber, pattern);
        }
    }
}

