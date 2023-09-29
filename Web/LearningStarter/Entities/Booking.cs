using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Globalization;

namespace LearningStarter.Entities
{
    public class Booking

    {
        public int ID { get; set; }
        public string CustomerId { get; set; }
        public string ShowtimeId { get; set; }
        public int BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set;}
        public int UserId { get; set;}
             

    }
       public class BookingGetDto
    {
        public int ID { get; set; }
        public string CustomerId { get; set; }
        public string ShowtimeId { get; set; }
        public int BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }
        public int UserId { get; set; }

    }
    public class BookingCreateDto
    {
        public int BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }


    }
    public class BookingUpdateDto
    {
        public int BookingDate { get; set; }
        public int NumberofTickets { get; set; }
        public int TenderAmount { get; set; }


    }
    public  class BookingEntityTypeConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("Bookings");
        }

    }
}