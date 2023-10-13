using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        // GET: api/values
        [HttpGet]
        public IActionResult GetAll()
        {
            var response = new Response();

            var data = _dataContext
                .Set<Theaters>()
                .Select(theaters => new TheaterGetDto
                {

                    Id = theaters.Id,
                    Address = theaters.Address,
                    HallNumbers = theaters.HallNumbers,
                    Email = theaters.Email,
                    Phone = theaters.Phone,
                    Screen = theaters.Screen,
                    Reviews = theaters.Reviews,
                    Review = theaters.Review.Select(x => new TheaterReviewsGetDto
                    {
                        Id = x.Review.Id,
                        TheaterReview = x.Review.TheaterReview,
                        Rating = x.Review.Rating,
                        UserId = x.Review.UserId,
                        TheaterId = x.Review.TheaterId
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

            var theater = _dataContext
                .Set<Theaters>()
                .FirstOrDefault(Theaters => Theaters.Id == id);

            if (theater == null)
            {
                response.AddError("id", "Theater not found");
                return NotFound(response);
            }

            var theaterToReturn = new TheaterGetDto
            {

                Id = theater.Id,
                Address = theater.Address,
                HallNumbers = theater.HallNumbers,
                Email = theater.Email,
                Phone = theater.Phone,
                Screen = theater.Screen,
                Reviews = theater.Reviews,
                Review = theater.Review.Select(x => new TheaterReviewsGetDto
                {
                    Id = x.Review.Id,
                    TheaterReview = x.Review.TheaterReview,
                    Rating = x.Review.Rating,
                    UserId = x.Review.UserId,
                    TheaterId = x.Review.TheaterId

                }).ToList()

            };
            

            response.Data = theaterToReturn;

            return Ok(response);
        }
    

        // POST api/values
        [HttpPost]
        public IActionResult Create([FromBody] TheaterCreateDto createDto)
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
                Address = createDto.Address,
                TheaterName=createDto.TheaterName,
                HallNumbers = createDto.HallNumbers,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Screen = createDto.Screen,
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
                Screen = TheaterToCreate.Screen,
             
            };

            response.Data = TheaterToReturn;

            return Created("", response);
        }
        // /api/theaters/3/review/2?
        [HttpPost("{theaterId}/review/{reviewsId}")]
        public IActionResult AddReviewToTheaters(int theaterId, int reviewId, [FromQuery] int quantity)
        {
            var response = new Response();

            var theaters = _dataContext.Set<Theaters>()
                .FirstOrDefault(x => x.Id == theaterId);

            var review = _dataContext.Set<Reviews>()
                .FirstOrDefault(x => x.Id == reviewId);

            //validation

            var theaterReviews = new TheaterReviews
                {
                    Theaters = theaters,
                    Review = review,
                    Quantity = quantity
                };
                _dataContext.Set<TheaterReviews>().Add(theaterReviews);
                _dataContext.SaveChanges();

            response.Data = new TheaterGetDto
            {

                Id = theaters.Id,
                Address = theaters.Address,
                HallNumbers = theaters.HallNumbers,
                Email = theaters.Email,
                Phone = theaters.Phone,
                Screen = theaters.Screen,
                Reviews = theaters.Reviews,
                Review = theaters.Review.Select(x => new TheaterReviewsGetDto
                {
                    Id = x.Review.Id,
                    TheaterReview = x.Review.TheaterReview,
                    Rating = x.Review.Rating,
                    UserId = x.Review.UserId,
                    TheaterId = x.Review.TheaterId

                }).ToList()
            };

            return Ok(response);
        }
    
        // PUT api/values/5
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
            TheaterToUpdate.Screen = updateDto.Screen;
            TheaterToUpdate.Reviews = updateDto.Reviews;

            _dataContext.SaveChanges();

            var TheaterToReturn = new TheaterGetDto
            {
                Address = TheaterToUpdate.Address,
                TheaterName = TheaterToUpdate.TheaterName,
                Phone = TheaterToUpdate.Phone,
                HallNumbers = TheaterToUpdate.HallNumbers,
                Email = TheaterToUpdate.Email,
                Screen = TheaterToUpdate.Screen,
                
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

