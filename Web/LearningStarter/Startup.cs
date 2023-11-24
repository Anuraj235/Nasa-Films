using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
        services.AddControllers();

        services.AddHsts(options =>
        {
            options.MaxAge = TimeSpan.MaxValue;
            options.Preload = true;
            options.IncludeSubDomains = true;
        });

        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddIdentity<User, Role>(
                options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 8;
                    options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                    options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                    options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
                })
            .AddEntityFrameworkStores<DataContext>();

        services.AddMvc();

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = "file", Format = "binary" });
        });

        services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "learning-starter-web/build";
        });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext, ILogger<Startup> logger)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();

        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger(options =>
        {
            options.SerializeAsV2 = true;
        });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1");
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });

        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
        try
        {
            SeedUsers(dataContext, userManager).Wait();
            SeedTheaters(dataContext);
            SeedReviews(dataContext);

            SeedScreens(dataContext);
            SeedMovie(dataContext);

            SeedShowtimes(dataContext);
            SeedBookings(dataContext);

            SeedShowtimeBooking(dataContext);

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }

    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
            var seededUser = new User
            {
                FirstName = "John",
                LastName = "Seed",
                UserName = "admin",
                Email = "johntheadmin@yahoo.com",
                PhoneNumber = "9898989898",
                DateOfBirth = DateTime.Now,
            };

            var seededUser1 = new User
            {
                FirstName = "Anuraj",
                LastName = "Pant",
                UserName = "pantanuraj",
                Email = "iamanuraj@wohoo.com",
                PhoneNumber = "6969696969",
                DateOfBirth = DateTime.Now,
            };

            var seededUser2 = new User
            {
                FirstName = "Satyam",
                LastName = "Pathak",
                UserName = "satyam",
                Email = "pathaksatyam@yehoo.com",
                PhoneNumber = "8989898989",
                DateOfBirth = DateTime.Now,
            };

            await userManager.CreateAsync(seededUser2, "satyam123");
            await userManager.CreateAsync(seededUser1, "anuraj123");
            await userManager.CreateAsync(seededUser, "Password");
            await dataContext.SaveChangesAsync();
        }
    }

    public static void SeedTheaters(DataContext dataContext)
    {
        if (dataContext.Set<Theaters>().Any())
        {
            return;
        }

        var seededTheaters = new List<Theaters>()
        {
            new(){
                TheaterName = "NASSA Films",
                Address = "This Street Ave",
                Phone = "0123456789",
                Email = "nassafilms@watch.com"
            },

            new(){
            TheaterName = "NASSA Southeastern",
            Address = "Southeastern Street Ave",
            Phone = "1234532345",
            Email = "nassafilms@selu.edu"
            },

            new(){
            TheaterName = "NASSA LSU",
            Address = "LSU Street Ave",
            Phone = "9871234564",
            Email = "nassafilms@lsu.edu"
            },

        };
        dataContext.Set<Theaters>().AddRange(seededTheaters);
        dataContext.SaveChanges();
    }

    public static void SeedMovie(DataContext dataContext)
    {
        if (dataContext.Set<Movie>().Any())
        {
            return;
        }

        var seededMovie = new List<Movie>()
        {
            new(){
                Title = "One Piece Red",
                Rating = 5,
                //ReleaseDate = 2023 - 01 - 01,
                Description = "Uta is a beloved singer, renowned for concealing her own identity when performing. Her voice is described as \"otherworldly.\" Now, for the first time ever, Uta will reveal herself to the world at a live concert.",
                Genre = "Animation",
                Duration = 120,
                TrailerUrl = "https://www.youtube.com/watch?v=89JWRYEIG-s&pp=ygUNb25lIHBpZWNlIHJlZA%3D%3D",
                ImageUrl = "https://i.redd.it/z4pkzmtwb8r81.jpg"
            },
            new(){
                Title = "Taylor Swift The Eros Tour",
                Rating = 3,
                //ReleaseDate = 2023 - 01 - 01,
                Description = " The cultural phenomenon continues as pop icon Taylor Swift performs hit songs in a once-in-a-lifetime concert experience.",
                Genre = "Documentary",
                Duration = 164,
                TrailerUrl = "https://www.youtube.com/watch?v=KudedLV0tP0&pp=ygUaVGF5bG9yIFN3aWZ0IFRoZSBFcm9zIFRvdXI%3D",
                ImageUrl = "https://m.media-amazon.com/images/M/MV5BM2E0NjA5MDktYmUxOC00NWUzLWJlNzMtZmJlNjU1ODZiMjgyXkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_.jpg"
            },
            new(){
                Title = "Your Name",
                Rating = 4,
                //ReleaseDate = 2023 - 01 - 01,
                Description = "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.",
                Genre = "Animation",
                Duration = 164,
                TrailerUrl = "https://www.youtube.com/watch?v=-pHfPJGatgE&pp=ygUJeW91ciBuYW1l",
                ImageUrl = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSdCn7P_niNCbNFHt9vLgDc-YlRIhwvnCPtHzyiHVP_GK-XmDS1"
            },
            new(){
                Title = "One Direction: This Is Us",
                Rating = 4,
                //ReleaseDate = 2023 - 01 - 01,
                Description = "Groomed for stardom by \"X-Factor's\" Simon Cowell, the members of pop supergroup One Direction -- Niall Horan, Zayn Malik, Harry Styles, Louis Tomlinson and Liam Payne -- have emerged as a worldwide phenomenon. ",
                Genre = "Documentary",
                Duration = 184,
                TrailerUrl = "https://www.youtube.com/watch?v=MmqeOZXhycg&pp=ygUZT25lIERpcmVjdGlvbjogVGhpcyBJcyBVcw%3D%3D",
                ImageUrl = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR7Wrvd1v6Y7QfTmiz3UJ0RylsREWLkjQOpz--_86AACtKnHLoW"
            },
             new(){
                Title = "Next Goal Wins",
                Rating = 3,
                //ReleaseDate = 2023 - 01 - 01,
                Description = "Next Goal Wins is a 2023 American biographical sports comedy-drama film directed by Taika Waititi, who co-wrote the screenplay with Iain Morris. It is based on the 2014 documentary of the same name by Mike Brett and Steve Jamison about Dutch-American coach Thomas Rongen's efforts to lead the American Samoa national football team, considered one of the weakest football teams in the world, to qualification for the 2014 FIFA World Cup. ",
                Genre = "Comedy",
                Duration = 95,
                TrailerUrl = "https://www.youtube.com/watch?v=pRH5u5lpArQ&pp=ygUOTmV4dCBHb2FsIFdpbnM%3D",
                ImageUrl = "https://imgs.search.brave.com/mtL0Rm7wTWSEtxQAS-fw8cLQ9yL2OuDGGC_b9EyB55Y/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zMy5h/bWF6b25hd3MuY29t/L3N0YXRpYy5yb2dl/cmViZXJ0LmNvbS91/cGxvYWRzL21vdmll/L21vdmllX3Bvc3Rl/ci9uZXh0LWdvYWwt/d2lucy0yMDIzL2xh/cmdlX25leHQtZ29h/bC13aW5zLW1vdmll/LXBvc3Rlci0yMDIz/LmpwZWc"
            },
              new(){
                Title = "The Marvels",
                Rating = 3,
                //ReleaseDate = 2023 - 01 - 01,
                Description = "The Marvels is a 2023 American superhero film based on Marvel Comics. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures, it is the sequel to the film Captain Marvel (2019), a continuation of the television miniseries Ms. Marvel (2022), and the 33rd film in the Marvel Cinematic Universe (MCU). ",
                Genre = "Action",
                Duration = 157,
                TrailerUrl = "https://www.youtube.com/watch?v=uwmDH12MAA4&pp=ygULVGhlIE1hcnZlbHM%3D",
                ImageUrl = "https://imgs.search.brave.com/pvbUFBOHcHlIq8dokVC--MVj0JrXq18D3LeXzJnziWM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/bWFydmVsLmNvbS9j/b250ZW50LzF4L3Ro/ZW1hcnZlbHNfbG9i/X2NyZF8wNS5qcGc"
            },
        };

        dataContext.Set<Movie>().AddRange(seededMovie);
        dataContext.SaveChanges();
    }

    public static void SeedBookings(DataContext dataContext)
    {
        if (dataContext.Set<Booking>().Any())
        {
            return;
        }

        var seededBookings = new Booking
        {
            ShowtimeId = 1,
            //BookingDate = ,
            NumberofTickets = 3,
            TenderAmount = 20,
            UserId = 1,

        };

        dataContext.Set<Booking>().Add(seededBookings);
        dataContext.SaveChanges();
    }

    public static void SeedReviews(DataContext dataContext)
    {
        if (dataContext.Set<Reviews>().Any())
        {
            return;
        }

        var seededReview = new List<Reviews>()
        {
            // Reviews for Theater 1
        new Reviews
        {
            TheaterReview = "Fantastic experience!",
            Rating = 5,
            UserId = 1,
            TheaterId = 1
        },

        new Reviews
        {
            TheaterReview = "Not a fan of the movie choices.",
            Rating = 2,
            UserId = 2,
            TheaterId = 1
        },

        new Reviews
        {
            TheaterReview = "Average experience.",
            Rating = 3,
            UserId = 3,
            TheaterId = 1
        },

        // Reviews for Theater 2
        new Reviews
        {
            TheaterReview = "Good movie selection!",
            Rating = 4,
            UserId = 1,
            TheaterId = 2
        },

        new Reviews
        {
            TheaterReview = "Service could be better.",
            Rating = 2,
            UserId = 2,
            TheaterId = 2
        },

        new Reviews
        {
            TheaterReview = "Great customer service!",
            Rating = 4,
            UserId = 3,
            TheaterId = 2
        },

        // Reviews for Theater 3
        new Reviews
        {
            TheaterReview = "Enjoyed the ambiance!",
            Rating = 4,
            UserId = 1,
            TheaterId = 3
        },

        new Reviews
        {
            TheaterReview = "Decent experience overall.",
            Rating = 3,
            UserId = 2,
            TheaterId = 3
        },

        new Reviews
        {
            TheaterReview = "Not impressed with the facilities.",
            Rating = 2,
            UserId = 3,
            TheaterId = 3
        },

        // Additional Reviews
        new Reviews
        {
            TheaterReview = "Theater was clean and comfortable!",
            Rating = 5,
            UserId = 1,
            TheaterId = 1
        },

        new Reviews
        {
            TheaterReview = "Not a fan of the movie choices.",
            Rating = 2,
            UserId = 2,
            TheaterId = 1
        },

        new Reviews
        {
            TheaterReview = "Average experience.",
            Rating = 3,
            UserId = 3,
            TheaterId = 1
        },

        new Reviews
        {
            TheaterReview = "Great customer service!",
            Rating = 4,
            UserId = 1,
            TheaterId = 2
        },

        new Reviews
        {
            TheaterReview = "Fantastic experience!",
            Rating = 5,
            UserId = 2,
            TheaterId = 2
        }
    };
        

        dataContext.Set<Reviews>().AddRange(seededReview);
        dataContext.SaveChanges();
    }

    public static void SeedScreens(DataContext dataContext)
    {
        if (dataContext.Set<Screen>().Any())
        {
            return;
        }

        var seededScreen = new List<Screen>()
        {
            new()
            {
                TotalCapacity = 152,
                TheaterId = 1,
            },
            new()
            {
                TotalCapacity = 85,
                TheaterId = 1,
            }
        };

        dataContext.Set<Screen>().AddRange(seededScreen);
        dataContext.SaveChanges();
    }

    public static void SeedShowtimes(DataContext dataContext)
    {
        if (dataContext.Set<Showtimes>().Any())
        {
            return;
        }

        var seededShowtimes = new List<Showtimes>()
        {
            // Theater 1
        new Showtimes
        {
            MovieId = 1,
            StartTime = "9:00 AM",
            TheaterID = 1,
            AvailableSeats = 85,
        },
        new Showtimes
        {
            MovieId = 1,
            StartTime = "12:00 PM",
            TheaterID = 1,
            AvailableSeats = 85,
        },
        new Showtimes
        {
            MovieId = 1,
            StartTime = "04:00 PM",
            TheaterID = 1,
            AvailableSeats = 75,
        },

        // Theater 2
        new Showtimes
        {
            MovieId = 2,
            StartTime = "10:30 AM",
            TheaterID = 2,
            AvailableSeats = 90,
        },
        new Showtimes
        {
            MovieId = 2,
            StartTime = "02:30 PM",
            TheaterID = 2,
            AvailableSeats = 80,
        },
        new Showtimes
        {
            MovieId = 2,
            StartTime = "06:30 PM",
            TheaterID = 2,
            AvailableSeats = 85,
        },

        // Theater 3
        new Showtimes
        {
            MovieId = 3,
            StartTime = "11:00 AM",
            TheaterID = 3,
            AvailableSeats = 80,
        },
        new Showtimes
        {
            MovieId = 3,
            StartTime = "03:00 PM",
            TheaterID = 3,
            AvailableSeats = 75,
        },
        new Showtimes
        {
            MovieId = 3,
            StartTime = "07:00 PM",
            TheaterID = 3,
            AvailableSeats = 90,
        },

        // Additional showtimes
        new Showtimes
        {
            MovieId = 4,
            StartTime = "12:30 PM",
            TheaterID = 1,
            AvailableSeats = 85,
        },
        new Showtimes
        {
            MovieId = 4,
            StartTime = "04:30 PM",
            TheaterID = 2,
            AvailableSeats = 80,
        },
        new Showtimes
        {
            MovieId = 5,
            StartTime = "02:00 PM",
            TheaterID = 3,
            AvailableSeats = 90,
        },
        new Showtimes
        {
            MovieId = 5,
            StartTime = "06:00 PM",
            TheaterID = 1,
            AvailableSeats = 75,
        },
        new Showtimes
        {
            MovieId = 6,
            StartTime = "03:30 PM",
            TheaterID = 2,
            AvailableSeats = 85,
        },
        new Showtimes
        {
            MovieId = 6,
            StartTime = "07:30 PM",
            TheaterID = 3,
            AvailableSeats = 80,
        },
        };

        dataContext.Set<Showtimes>().AddRange(seededShowtimes);
        dataContext.SaveChanges();
    }

    public static void SeedShowtimeBooking(DataContext dataContext)
    {
        if (dataContext.Set<ShowtimeBooking>().Any())
        {
            return;
        }

        var seededShowtimeBookings = new ShowtimeBooking
        {
            Showtime = dataContext.Set<Showtimes>().First(),
            Booking = dataContext.Set<Booking>().First()
        };

        dataContext.Set<ShowtimeBooking>().Add(seededShowtimeBookings);
        dataContext.SaveChanges();
    }
}