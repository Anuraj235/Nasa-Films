using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace LearningStarter.Entities
{
    public class TheaterReviews
    {
        public int Id { get; set; }


        public int StoreId { get; set; }
        public Theaters Theaters { get; set; }
        public int ReviewId { get; set; }
        public Reviews Review { get; set; }

        public int ReviewQuantity { get; set; }

    }

    public class TheaterReviewsGetDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public int UserId { get; set; }
        public int TheaterId { get; set; }
    }
    public class TheaterReviewsEntityTypeConfiguration : IEntityTypeConfiguration<TheaterReviews>
    {
        public void Configure(EntityTypeBuilder<TheaterReviews> builder)
        {
            builder.ToTable("TheaterReviews");

            builder.HasOne(x => x.Theaters)
                .WithMany(x => x.Review);

            builder.HasOne(x => x.Review)
                .WithMany();



        }
    }
}
