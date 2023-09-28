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


}

