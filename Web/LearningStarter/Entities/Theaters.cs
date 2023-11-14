using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities
{
    public class Theaters
    {
        public int Id { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public int? ReviewId { get; }
        public List<Reviews> Reviews { get; }
        public int ScreenId { get; set; }
        public List<Screen> Screens { get; set; }

        public List<Showtimes> Showtimes { get; set; }
        public List<Booking> Boookings { get; set; }
    }

    public class TheaterGetDto
    {
        public int Id { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<TheaterReviewGetDto> Reviews { get; set; }
        public List<ScreenGetDto> Screens { get; set; }

        public List<TheaterShowtimeGetDto> Showtimes { get; set; }
    }

    public class ShowtimeTheaterGetDto
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }


    }
    public class TheaterCreateDto
    {
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class TheaterUpdateDto
    {
        public int Id { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class TheatersEntityTypeConfiguration : IEntityTypeConfiguration<Theaters>
    {
        public void Configure(EntityTypeBuilder<Theaters> builder)
        {
            builder.ToTable("Theaters");
        }
    }
}
