using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace LearningStarter.Entities;

public class Screen
{
    public int Id { get; set; }
    public int TheaterId { get; set; }
    public Theaters Theater { get; set; }
    public int TotalCapacity { get; set; }
}

public class ScreenGetDto
{
    public int Id { get; set; }
    public int TheaterId { get; set; }
    public int TotalCapacity { get; set; }
}



public class ScreenCreateDto
{
    public int TotalCapacity { get; set; }
    public int TheaterId { get; set;}
}


public class ScreenUpdateDto
{
    public int TotalCapacity { get; set; }
    public int TheaterId { get; set;}
}

public class ScreenEntityConfiguration : IEntityTypeConfiguration<Screen>
{
    public void Configure(EntityTypeBuilder<Screen> builder)
    {
       
        builder.ToTable("Screens");
    }
}