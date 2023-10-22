﻿
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;

namespace LearningStarter.Entities
{
    public class ShowtimeBooking
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public Showtimes Showtime { get; set; }

        public int BookingId { get; set; }
        public Booking Booking { get; set; }
        public int TotalBooking { get; set; }


    }

    public class ShowtimeBookingGetDto
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }
        public int AvailableSeats { get; set; }
        public DateTime StartTime { get; set; }

        public int Price { get; set; }
        public string Screen { get; set; }


    }
    public class ShowtimeBookingEntityTypeConfiguration : IEntityTypeConfiguration<ShowtimeBooking>
    {
        public void Configure(EntityTypeBuilder<ShowtimeBooking> builder)
        {
            builder.ToTable("ShowtimeBookings");

            builder.HasOne(x => x.Showtime)
            .WithMany(x => x.Bookings);

            builder.HasOne(x => x.Booking)
            .WithMany();
        }

    }
}

