using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Reviews
{
	public int Id { get; set; }
	public string TheaterReview { get; set; }
	public int Rating { get; set; }

	public int UserId { get; set; }
    public User User { get; set; }

    public int TheaterId { get; set; }
    public Theaters Theater { get; set; }
}

public class ReviewsGetDto
{
    public int Id { get; set; }
    public string TheaterReview { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int TheaterId { get; set; }
}

public class UserReviewGetDto
{
    public int  Id { get; set; }
    public string UserReview { get; set; }
    public int Rating { get; set; }
    public int TheaterId { get; set; }
    public string TheaterName { get; set; }
}

public class TheaterReviewGetDto
{
    public int Id { get; set; }
    public string TheaterReview { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    //public int TheaterId { get; set; }
}

public class ReviewsCreateDto
{
    public string TheaterReview { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int TheaterId { get; set; }
}

public class ReviewsUpdateDto
{
    public int Id { get; set; }
    public string TheaterReview { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int TheaterId { get; set; }
}

public class ReviewsEntityTypeConfiguration : IEntityTypeConfiguration<Reviews>
{
    public void Configure(EntityTypeBuilder<Reviews> builder)
    {
        builder.ToTable("Reviews");
    }
}