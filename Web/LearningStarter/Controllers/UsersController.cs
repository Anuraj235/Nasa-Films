using System.Linq;
using System.Numerics;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public UsersController(DataContext context,
        UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context
            .Users
            .Select(user => new UserGetDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                PaymentOptions = user.PaymentOptions,
                Loyalty = user.Loyalty,
                Reviews = user.Reviews.Select(x => new UserReviewGetDto
                {
                    Id = x.Id,
                    TheaterId = x.Theater.Id,
                    TheaterName = x.Theater.TheaterName,
                    UserReview = x.TheaterReview,
                    Rating = x.Rating
                }).ToList(),

                Bookings = user.Bookings.Select(x => new UserBookingsGetDto
                {
                    ID = x.Id,
                    StartTime = x.Showtime.StartTime,
                    BookingDate = x.Booking.BookingDate,
                    TotalBooking = x.Booking.NumberofTickets

                }).ToList(),
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(
        [FromRoute] int id)
    {
        var response = new Response();

        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "There was a problem finding the user.");
            return NotFound(response);
        }

        var userGetDto = new UserGetDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            PaymentOptions = user.PaymentOptions,
            Loyalty = user.Loyalty,
            Reviews = user.Reviews.Select(x => new UserReviewGetDto
            {
                Id = x.Id,
                TheaterId = x.Theater.Id,
                TheaterName = x.Theater.TheaterName,
                UserReview = x.TheaterReview,
                Rating = x.Rating
            }).ToList(),
            Bookings = user.Bookings.Select(x => new UserBookingsGetDto
            {
                ID = x.Id,
                StartTime = x.Showtime.StartTime,
                BookingDate = x.Booking.BookingDate,
                TotalBooking = x.Booking.NumberofTickets

            }).ToList(),
        };

        response.Data = userGetDto;

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create(
        [FromBody] UserCreateDto userCreateDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(userCreateDto.FirstName))
        {
            response.AddError("firstName", "First name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.LastName))
        {
            response.AddError("lastName", "Last name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.UserName))
        {
            response.AddError("userName", "User name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.Password))
        {
            response.AddError("password", "Password cannot be empty.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var userToCreate = new User
        {
            FirstName = userCreateDto.FirstName,
            LastName = userCreateDto.LastName,
            UserName = userCreateDto.UserName,
            Email = userCreateDto.Email,
            PhoneNumber = userCreateDto.PhoneNumber,
            DateOfBirth = userCreateDto.DateOfBirth,
            PaymentOptions = userCreateDto.PaymentOptions,
            Loyalty = userCreateDto.Loyalty
        };
        _context.Set<User>().Add(userToCreate);
        _context.SaveChanges();
        _userManager.CreateAsync(userToCreate, userCreateDto.Password);
        _userManager.AddToRoleAsync(userToCreate, "Admin");
        _context.SaveChanges();

        var userGetDto = new UserGetDto
        {
            Id = userToCreate.Id,
            FirstName = userToCreate.FirstName,
            LastName = userToCreate.LastName,
            UserName = userToCreate.UserName,
            Email = userToCreate.Email,
            PhoneNumber = userToCreate.PhoneNumber,
            DateOfBirth = userToCreate.DateOfBirth,
            PaymentOptions = userToCreate.PaymentOptions,
            Loyalty = userToCreate.Loyalty
        };

        response.Data = userGetDto;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Edit(
        [FromRoute] int id,
        [FromBody] UserUpdateDto userUpdateDto)
    {
        var response = new Response();

        if (userUpdateDto == null)
        {
            response.AddError("id", "There was a problem editing the user.");
            return NotFound(response);
        }

        var userToEdit = _context.Users.FirstOrDefault(x => x.Id == id);

        if (userToEdit == null)
        {
            response.AddError("id", "Could not find user to edit.");
            return NotFound(response);
        }

        if (string.IsNullOrEmpty(userUpdateDto.FirstName))
        {
            response.AddError("firstName", "First name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.LastName))
        {
            response.AddError("lastName", "Last name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.UserName))
        {
            response.AddError("userName", "User name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.Password))
        {
            response.AddError("password", "Password cannot be empty.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        userToEdit.FirstName = userUpdateDto.FirstName;
        userToEdit.LastName = userUpdateDto.LastName;
        userToEdit.UserName = userUpdateDto.UserName;
        userToEdit.Email = userUpdateDto.Email;
        userToEdit.PhoneNumber = userUpdateDto.PhoneNumber;
        userToEdit.DateOfBirth = userUpdateDto.DateOfBirth;
        userToEdit.PaymentOptions = userUpdateDto.PaymentOptions;
        userToEdit.Loyalty = userUpdateDto.Loyalty;

        _context.SaveChanges();

        var userGetDto = new UserGetDto
        {
            Id = userToEdit.Id,
            FirstName = userToEdit.FirstName,
            LastName = userToEdit.LastName,
            UserName = userToEdit.UserName,
            Email = userToEdit.Email,
            PhoneNumber = userToEdit.PhoneNumber,
            DateOfBirth = userToEdit.DateOfBirth,
            PaymentOptions = userToEdit.PaymentOptions,
            Loyalty = userToEdit.Loyalty
        };

        response.Data = userGetDto;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "There was a problem deleting the user.");
            return NotFound(response);
        }

        _context.Users.Remove(user);
        _context.SaveChanges();

        return Ok(response);
    }

    [HttpPost("{userId}/booking/{bookingId}")]
    public IActionResult AddUserBooking(int userId, int bookingId, [FromQuery] int numberOfTickets)
    {
        var response = new Response();

        var user = _context.Set<User>()
            .FirstOrDefault(x => x.Id == userId);

        var booking = _context.Set<Booking>()
            .FirstOrDefault(x => x.ID == bookingId);

        var userBooking = new ShowtimeBooking
        {
            UserId = user.Id,
            BookingId = booking.ID,
            TotalBooking = numberOfTickets
        };

        _context.Set<ShowtimeBooking>().Add(userBooking);
        _context.SaveChanges();

        response.Data = new UserGetDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            PaymentOptions = user.PaymentOptions,
            Loyalty = user.Loyalty,
            Bookings = user.Bookings.Select(x => new UserBookingsGetDto
            {
                ID = x.Id,
                StartTime = x.Showtime.StartTime,
                BookingDate = x.Booking.BookingDate,
                TotalBooking = x.TotalBooking

            }).ToList(),
        };

        return Ok(response);
    }
}