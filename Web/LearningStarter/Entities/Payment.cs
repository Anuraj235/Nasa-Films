using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Globalization;

namespace LearningStarter.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public string CardName { get; set; }
        public int CardNumber { get; set; }
        public int CardCvv { get; set; }
        public DateTime CardExpiry { get; set; }
    }

    public class PaymentGetDto
    {
        public int Id { get; set; }
        public string CardName { get; set; }
        public int CardNumber { get; set; }
        public int CardCvv { get; set; }
        public DateTime CardExpiry { get; set; }
    }
    public class PaymentCreateDto
    {
        public string CardName { get; set; }
        public int CardNumber { get; set; }
        public int CardCvv { get; set; }
        public DateTime CardExpiry { get; set; }
    }
    public class PaymentUpdateDto
    {
        public string CardName { get; set; }
        public int CardNumber { get; set; }
        public int CardCvv { get; set; }
        public DateTime CardExpiry { get; set; }
    }
    public class PaymentEntityTypeConfiguraton : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            {
                builder.ToTable("Payments");
            }

        }
    }
}

