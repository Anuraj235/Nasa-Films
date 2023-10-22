using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Globalization;

namespace LearningStarter.Entities
{
    public class Booking

    {
        public int ID { get; set; }
        public int CustomerId { get; set; }
        public int ShowtimeId { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }
        public int UserId { get; set; }


    }
    public class BookingGetDto
    {
        public int ID { get; set; }
        public int CustomerId { get; set; }
        public int ShowtimeId { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }
        public int UserId { get; set; }

    }
    public class BookingCreateDto
    {
        public int CustomerId { get; set; }
        public int ShowtimeId { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }


    }
    public class BookingUpdateDto
    {
        public int CustomerId { get; set; }
        public int ShowtimeId { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }


    }
    public class BookingEntityTypeConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("Bookings");
        }

    }
}