using System.Linq;
using System.Net.Http.Headers;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;


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
				Price = showtimes.Price,
				AvailableSeats = showtimes.AvailableSeats,
				Screen = showtimes.Screen,

			})
			.ToList();

		response.Data = data;

		return Ok(response);
	}

	[HttpPost]
	public IActionResult Create([FromBody] ShowtimesCreateDto createDto)
	{
		var response = new Response();

		if (createDto.Price < 0)
		{
			response.AddError(nameof(createDto.Price), "Price must be positive");
		}
        if (createDto.AvailableSeats < 0)
        {
            response.AddError(nameof(createDto.AvailableSeats), "AvailableSeats must be positive");
        }

        if (string.IsNullOrEmpty(createDto.Screen))
        {
            response.AddError(nameof(createDto.Screen), "Screen name is required");

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
			Price = createDto.Price,
			AvailableSeats = createDto.AvailableSeats,
			Screen = createDto.Screen
		};

		_dataContext.Set<Showtimes>().Add(showtimeToCreate);
		_dataContext.SaveChanges();

		var showtimeToReturn = new ShowtimesGetDto
		{
			Id = showtimeToCreate.Id,
			MovieId = showtimeToCreate.MovieId,
			StartTime = showtimeToCreate.StartTime,
			TheaterID = showtimeToCreate.TheaterID,
			Price = showtimeToCreate.Price,
			AvailableSeats = showtimeToCreate.AvailableSeats,
			Screen = showtimeToCreate.Screen,
		};

		response.Data = showtimeToReturn;

		return Created("", response);
	}
	[HttpPut("{id}")]
	public IActionResult Update([FromBody] ShowtimesUpdateDto updateDto,int id)
	{
		var response = new Response();

        if (updateDto.Price < 0)
        {
            response.AddError(nameof(updateDto.Price), "Price must be positive");
        }
        if (updateDto.AvailableSeats < 0)
        {
            response.AddError(nameof(updateDto.AvailableSeats), "AvailableSeats must be positive");
        }

        if (string.IsNullOrEmpty(updateDto.Screen))
        {
            response.AddError(nameof(updateDto.Screen), "Screen name is required");
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
		showtimestoUpdate.Price = updateDto.Price;
		showtimestoUpdate.AvailableSeats = updateDto.AvailableSeats;
		showtimestoUpdate.Screen = updateDto.Screen;
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
		if(showtimestoDelete==null)
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
