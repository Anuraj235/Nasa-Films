﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class User : IdentityUser<int>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public List<UserRole> UserRoles { get; set; } = new();

    public DateTime DateOfBirth { get; set; }
    public int Loyalty { get; set; }

    public string PhoneNumber { get; set; }

    public int ReviewId { get; set; }
    public List<Reviews> Reviews { get; set; }

    public int BookingId { get; }
    public List<Booking> Bookings { get; set; }

    public List<Payment> Payments { get; set; } = new();
}

public class UserCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }

    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int Loyalty { get; set; }
}

public class UserUpdateDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int Loyalty { get; set; }
}

public class UserGetDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }

    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int Loyalty { get; set; }

    public List<PaymentGetDto> Payments { get; set; } = new();
    public List<UserReviewGetDto> Reviews { get; set; }
    public List<UserBookingsGetDto> Bookings { get; set; }
}

public class ReviewerGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.FirstName)
            .IsRequired();

        builder.Property(x => x.LastName)
            .IsRequired();

        builder.Property(x => x.UserName)
            .IsRequired();


    }
}
