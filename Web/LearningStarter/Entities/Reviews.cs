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
	public int TheaterId { get; set; }
}

public class ReviewsGetDto
{
    public int Id { get; set; }
    public string TheaterReview { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int TheaterId { get; set; }
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

        builder.HasOne<>
    }
}