using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace LearningStarter.Controllers;
[ApiController]
[RouteAttribute("api/bookings")]

public class BookingsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public BookingsController(DataContext dataContext)
    {
        _dataContext = dataContext;

    }
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<Booking>()
            .Select(booking => new BookingGetDto
            {
                ID = booking.ID,
                CustomerId = booking.CustomerId,
                ShowtimeId = booking.ShowtimeId,
                BookingDate = booking.BookingDate,
                NumberofTickets = booking.NumberofTickets,
                TenderAmount = booking.TenderAmount,
                UserId = booking.UserId,



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
            .Set<Booking>()
            .Select(booking => new BookingGetDto
            {
                ID = booking.ID,
                CustomerId = booking.CustomerId,
                ShowtimeId = booking.ShowtimeId,
                BookingDate = booking.BookingDate,
                NumberofTickets = booking.NumberofTickets,
                TenderAmount = booking.TenderAmount,
                UserId = booking.UserId,

            })
            .FirstOrDefault(booking => booking.ID == id);


        response.Data = data;
        return Ok(response);


    }


    [HttpPost]
    public IActionResult Create([FromBody] BookingCreateDto createDto)
    {
        var response = new Response();

       if( createDto.TenderAmount < 0 )
        {
            response.AddError(nameof(createDto.TenderAmount), "Tender Amount must be positive" );
        }
        if (createDto.NumberofTickets < 0)
        {
            response.AddError(nameof(createDto.NumberofTickets), "Number of Tickets  must be positive");
        }

        if(response.HasErrors) {
        return BadRequest(response);
        
        }


        var bookingToCreate = new Booking
        {
            BookingDate = createDto.BookingDate,
            NumberofTickets = createDto.NumberofTickets,
            TenderAmount = createDto.TenderAmount,
        };
        _dataContext.Set<Booking>().Add(bookingToCreate);
        _dataContext.SaveChanges();

        var bookingToReturn = new BookingGetDto
        {
            ID = bookingToCreate.ID,
            CustomerId = bookingToCreate.CustomerId,
            ShowtimeId = bookingToCreate.ShowtimeId,
            BookingDate = bookingToCreate.BookingDate,
            NumberofTickets = bookingToCreate.NumberofTickets,
            TenderAmount = bookingToCreate.TenderAmount,
            UserId = bookingToCreate.UserId,
        };
        response.Data = bookingToReturn;
        return Created("", response);

    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] BookingUpdateDto updateDto,  int id)
    {
        var response = new Response();
        
        if (updateDto.TenderAmount < 0)
        {
            response.AddError(nameof(updateDto.TenderAmount), "Tender Amount must be positive");
        }
        if (updateDto.NumberofTickets < 0)
        {
            response.AddError(nameof(updateDto.NumberofTickets), "Number of Tickets  must be positive");
        }

      
        var bookingToUpdate =  _dataContext.Set<Booking>()
            .FirstOrDefault(booking => booking.ID == id);

        if (bookingToUpdate == null)
        {
            response.AddError("id", "Booking not found .");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }



        bookingToUpdate.BookingDate = updateDto.BookingDate;
        bookingToUpdate.NumberofTickets= updateDto.NumberofTickets;
        bookingToUpdate.TenderAmount = updateDto.TenderAmount;


        _dataContext.SaveChanges();

        var bookingToReturn = new BookingGetDto
        {
            ID = bookingToUpdate.ID,
            CustomerId = bookingToUpdate.CustomerId,
            ShowtimeId = bookingToUpdate.ShowtimeId,
            BookingDate = bookingToUpdate.BookingDate,
            NumberofTickets = bookingToUpdate.NumberofTickets,
            TenderAmount = bookingToUpdate.TenderAmount,
            UserId = bookingToUpdate.UserId,

        };
        response.Data = bookingToReturn;
        return Ok(response);

    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var  response = new Response();
        
        var bookingToDelete= _dataContext.Set<Booking>()
            .FirstOrDefault(booking => booking.ID == id);

         if (bookingToDelete == null)
        {
            response.AddError("id", "Booking not found .");
        }
         if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Booking>().Remove(bookingToDelete);
        _dataContext.SaveChanges();

        response.Data = true; 
        return Ok(response);

    }

}


        

    

