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
        public int HallNumbers { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public int? ReviewId { get; }
        public List<Reviews> Reviews { get; }
    }

    public class TheaterGetDto
    {
        public int Id { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public int HallNumbers { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<TheaterReviewGetDto>? Reviews { get; set; }
    }

    public class TheaterCreateDto
    {
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public int HallNumbers { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class TheaterUpdateDto
    {
        public int Id { get; set; }
        public string TheaterName { get; set; }
        public string Address { get; set; }
        public int HallNumbers { get; set; }
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
