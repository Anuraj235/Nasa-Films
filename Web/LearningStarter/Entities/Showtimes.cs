using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LearningStarter.Entities
{
    public class Showtimes
    {
        public int Id { get; set; }
        public string StartTime { get; set; }
        public int TheaterID { get; set; }
        public int AvailableSeats { get; set; }

        public List<ShowtimeBooking> Bookings { get; set; } = new();
        public Theaters Theater { get; set; } = new();

        public int MovieId { get; set; }
        public Movie Movie { get; set; }

    }

    public class ShowtimesGetDto
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string StartTime { get; set; }
        public int TheaterID { get; set; }
        public int AvailableSeats { get; set; }

        public ShowtimeMovieGetDto Movie { get; set; }

        public List<ShowtimeBookingGetDto> Bookings { get; set; }

    }
    public class TheaterShowtimeGetDto
    {
        public int Id { get; set; }
        public string StartTime { get; set; }
        public int AvailableSeats { get; set; }
        public int MovieId { get; set; }


    }

    public class MovieShowtimeGetDto
    {
        public int Id { get; set; }
        public string StartTime { get; set; }
        public int TheaterID { get; set; }
        public int AvailableSeats { get; set; }
    }

    public class BookingShowtimeGetDto
    {
        public int Id { get; set; }
        public string StartTime { get; set; }
    }

    public class ShowtimesCreateDto
    {
        public int MovieId { get; set; }
        public string StartTime { get; set; }
        public int TheaterID { get; set; }
        public int AvailableSeats { get; set; }
    }
    public class ShowtimesUpdateDto
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string StartTime { get; set; }
        public int TheaterID { get; set; }
        public int AvailableSeats { get; set; }
    }
    public class ShowtimesEntityTypeConfiguration : IEntityTypeConfiguration<Showtimes>
    {
        public void Configure(EntityTypeBuilder<Showtimes> builder)
        {
            builder.ToTable("Showtimes");
        }
    }



}

