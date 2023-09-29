﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace LearningStarter.Entities;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int Rating { get; set; }
    public int ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
    public int ShowTimeId { get; set; }
}

public class MovieGetDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int Rating { get; set; }
    public int ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
    public int ShowTimeId { get; set; }
}


public class MovieCreateDto
{
    public string Title { get; set; }
    public int Rating { get; set; }
    public int ReleaseDate { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public int Duration { get; set; }
   
}


public class MovieUpdateDto
{
    public string Title { get; set; }
    public int Rating { get; set; }
    public int ReleaseDate { get; set; }
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

        builder.Property(x => x.Rating)
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



