using System.Linq;

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
}
