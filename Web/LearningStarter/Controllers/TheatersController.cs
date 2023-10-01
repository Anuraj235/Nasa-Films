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
                .Select(Theaters => new TheaterGetDto
                {
                    Id = Theaters.Id,
                    Address = Theaters.Address,
                    HallNumbers = Theaters.HallNumbers,
                    Email = Theaters.Email,
                    Phone = Theaters.Phone,
                    Screen = Theaters.Screen,
                    Reviews = Theaters. Reviews

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
                .FirstOrDefault(Theaters => Theaters.Id == id);

            if (Theater == null)
            {
                response.AddError("id", "Theater not found");
                return NotFound(response);
            }

            var theaterToReturn = new TheaterGetDto
            {
                Id = Theater.Id,
                Address = Theater.Address,
                HallNumbers = Theater.HallNumbers,
                Email = Theater.Email,
                Phone = Theater.Phone,
                Screen = Theater.Screen,
                Reviews = Theater.Reviews
            };

            response.Data = theaterToReturn;

            return Ok(response);
        }

        // POST api/values
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
                Address = createDto.Address,
                HallNumbers = createDto.HallNumbers,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Screen = createDto.Screen,
                Reviews = createDto.Reviews
            };

            _dataContext.Set<Theaters>().Add(TheaterToCreate);
            _dataContext.SaveChanges();

            var TheaterToReturn = new TheaterGetDto
            {
                Id = TheaterToCreate.Id,
                Address = TheaterToCreate.Address,
                HallNumbers = TheaterToCreate.HallNumbers,
                Email = TheaterToCreate.Email,
                Phone = TheaterToCreate.Phone,
                Screen = TheaterToCreate.Screen,
                Reviews = TheaterToCreate.Reviews
            };

            response.Data = TheaterToReturn;

            return Created("", response);
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
                Phone = TheaterToUpdate.Phone,
                HallNumbers = TheaterToUpdate.HallNumbers,
                Email = TheaterToUpdate.Email,
                Screen = TheaterToUpdate.Screen,
                Reviews = TheaterToUpdate.Reviews
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

