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
                FirstName = "Seeded",
                LastName = "User",
                UserName = "admin",
            };

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

        var seededTheaters = new Theaters
        {
            TheaterName = "NASSA Films",
            Address = "This Street Ave",
            Phone = "0123456789",
            Email = "nassafilms@watch.com"
        };

        dataContext.Set<Theaters>().Add(seededTheaters);
        dataContext.SaveChanges();
    }

    public static void SeedMovie(DataContext dataContext)
    {
        if (dataContext.Set<Movie>().Any())
        {
            return;
        }

        var seededMovie = new Movie
        {
            Title = "One Piece Red",
            Rating = 5,
            //ReleaseDate = 2023 - 01 - 01,
            Description = "Luffy meets Shanks!!!",
            Genre = "Fantacy",
            Duration = 120

        };

        dataContext.Set<Movie>().Add(seededMovie);
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

        var seededReview = new Reviews
        {
            TheaterReview = "Great place!",
            Rating = 5,
            UserId = 1,
            TheaterId = 1
        };

        dataContext.Set<Reviews>().Add(seededReview);
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
            new()
            {
                MovieId = 1,
                //StartTime = createDto.StartTime,
                TheaterID = 1,
                AvailableSeats = 85,

            },
            new()
            {
                MovieId = 1,
                //StartTime = createDto.StartTime,
                TheaterID = 1,
                AvailableSeats = 85,
            }
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