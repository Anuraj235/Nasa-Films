using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;

namespace LearningStarter.Entities;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
    public string ImageUrl { get; set; }

    public int ShowTimeId { get; set; }
    public List<Showtimes> Showtimes { get; set; }
}

public class MovieGetDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
    public string ImageUrl { get; set; }


    public int ShowTimeId { get; set; }
    public List<MovieShowtimeGetDto> Showtimes { get; set; }
}

public class ShowtimeMovieGetDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
}

public class MovieCreateDto
{
    public string Title { get; set; }
    public int Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
    public string ImageUrl { get; set; }

}


public class MovieUpdateDto
{
    public string Title { get; set; }
    public int Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
   
}

public class MovieEntityConfiguration : IEntityTypeConfiguration<Movie>
{
    public void Configure(EntityTypeBuilder<Movie> builder)
    {
        builder.Property(x => x.Id)
            .IsRequired();

        builder.Property(x => x.Title)
            .IsRequired();

        builder.Property(x => x.ReleaseDate)
            .IsRequired();

        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.Genre)
            .IsRequired();

        builder.Property(x => x.Duration)
            .IsRequired();

        builder.Property(x => x.ShowTimeId)
            .IsRequired();
    }
}



