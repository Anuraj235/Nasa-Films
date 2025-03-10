﻿using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
					TheaterId = Reviews.TheaterId,
					User = new ReviewerGetDto
					{
						UserId = Reviews.User.Id,
						FirstName = Reviews.User.FirstName,
						LastName = Reviews.User.LastName
					},
					Theater = new ReviewTheaterGetDto
					{
                        Id = Reviews.Theater.Id,
						TheaterId = Reviews.TheaterId,
						TheaterName = Reviews.Theater.TheaterName
                    },

                })
				.ToList();

			response.Data = data;

			return Ok(response);
		}

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var response = new Response();

            var Review = _dataContext
                .Set<Reviews>()
				.Include(x => x.User)
				.Include(x => x.Theater)
                .FirstOrDefault(Review => Review.Id == id);

            if (Review == null)
            {
                response.AddError("id", "Review not found");
                return NotFound(response);
            }

            var reviewToReturn = new ReviewsGetDto
            {
                Id = Review.Id,
                TheaterReview = Review.TheaterReview,
                Rating = Review.Rating,
                UserId = Review.UserId,
                TheaterId = Review.TheaterId,
                User = new ReviewerGetDto
                {
                    UserId = Review.User.Id,
                    FirstName = Review.User.FirstName,
                    LastName = Review.User.LastName
                },
                Theater = new ReviewTheaterGetDto
                {
                    Id = Review.Theater.Id,
                    TheaterId = Review.TheaterId,
                    TheaterName = Review.Theater.TheaterName
                },

            };

            response.Data = reviewToReturn;

            return Ok(response);
        }

        [HttpPost]
		public IActionResult Create([FromBody] ReviewsCreateDto createDto)
		{
			var response = new Response();

            if (string.IsNullOrEmpty(createDto.TheaterReview))
            {
				response.AddError(nameof(createDto.TheaterReview), "Review must not be empty.");
            }

            if (createDto.Rating < 0)
            {
                response.AddError(nameof(createDto.Rating), "Rating must be positive.");
            }

			if (response.HasErrors)
			{
				return BadRequest(response);
			}

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

			response.Data = ReviewToReturn;

			return Created("", response);
		}

		[HttpPut("{id}")]
		public IActionResult Update([FromBody] ReviewsUpdateDto updateDto, int id)
		{
			var response = new Response();

            if (string.IsNullOrEmpty(updateDto.TheaterReview))
            {
                response.AddError(nameof(updateDto.TheaterReview), "Review must not be empty.");
            }

            if (updateDto.Rating < 0)
            {
                response.AddError(nameof(updateDto.Rating), "Rating must be positive.");
            }

            var ReviewToUpdate = _dataContext
				.Set<Reviews>()
				.FirstOrDefault(Reviews => Reviews.Id == id);

            if (ReviewToUpdate == null)
            {
                response.AddError("id", "Review not found.");
            }

            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            ReviewToUpdate.TheaterReview = updateDto.TheaterReview;
			ReviewToUpdate.Rating = updateDto.Rating;

			_dataContext.SaveChanges();

			var ReviewToReturn = new ReviewsGetDto
			{
				Id = ReviewToUpdate.Id,
				TheaterReview = ReviewToUpdate.TheaterReview,
				Rating = ReviewToUpdate.Rating,
				UserId = ReviewToUpdate.UserId,
				TheaterId = ReviewToUpdate.TheaterId
			};

			response.Data = ReviewToReturn;

			return Ok(response);

        }

		[HttpDelete("{id}")]
		public IActionResult Delete(int id)
		{
			var response = new Response();

			var ReviewToDelete = _dataContext
				.Set<Reviews>()
				.FirstOrDefault(Reviews => Reviews.Id == id);

			if (ReviewToDelete == null)
			{
				response.AddError("id", "Review not found.");
			}

			if (response.HasErrors)
			{
				return BadRequest(response);
			}


			_dataContext.Set<Reviews>().Remove(ReviewToDelete);
			_dataContext.SaveChanges();

			response.Data = true;
			return Ok(response);
		}

	}
}

