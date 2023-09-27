using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("/api/reviews")]
    public class ReviewsController : ControllerBase
	{
		private readonly DataContext _dataContext;
		public ReviewsController(DataContext dataContext)
		{
			_dataContext = dataContext;
		}

		[HttpGet]
		public IActionResult GetAll()
		{
			var response = new Response();

			var data = _dataContext
				.Set<Reviews>()
				.Select(Reviews => new ReviewsGetDto
				{
					Id = Reviews.Id,
					TheaterReview = Reviews.TheaterReview,
					Rating = Reviews.Rating,
					UserId = Reviews.UserId,
					TheaterId = Reviews.TheaterId
				})
				.ToList();

			response.Data = data;

			return Ok(response);
		}

		[HttpPost]
		public IActionResult Create([FromBody] ReviewsCreateDto createDto)
		{
			var response = new Response();

			var ReviewsToCreate = new Reviews
			{
				TheaterReview = createDto.TheaterReview,
				Rating = createDto.Rating,
				UserId = createDto.UserId,
				TheaterId = createDto.TheaterId
			};

			_dataContext.Set<Reviews>().Add(ReviewsToCreate);
			_dataContext.SaveChanges();

			var ReviewToReturn = new ReviewsGetDto
			{
				Id = ReviewsToCreate.Id,
				TheaterReview = ReviewsToCreate.TheaterReview,
				Rating = ReviewsToCreate.Rating,
				UserId = ReviewsToCreate.UserId,
				TheaterId = ReviewsToCreate.TheaterId
			};

			response.Data = ReviewsToCreate;

			return Created("", response);
		}

	}
}

