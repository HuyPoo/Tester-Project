using System.Security.Claims;
using Api;
using Api.Filters;
using Business;
using Business.DTOs;
using Business.Mappings;
using Business.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Persistence.Entities;
using Persistence.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services
    .AddIdentity<User, IdentityRole>(options =>
    {
        // Temp disable password requirements
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;

        options.User.RequireUniqueEmail = true;

        // options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromMinutes(10);
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<JwtSettings>(sp => sp.GetRequiredService<IOptions<JwtSettings>>().Value);

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddSingleton<EmailSettings>(sp => sp.GetRequiredService<IOptions<EmailSettings>>().Value);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = jwtSettings.GetSymmetricSecurityKey()
        };
    });

builder.Services.AddRepositories();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddBusinessServices();

builder.Services.AddControllers(
    options => { options.Filters.Add<ApiExceptionFilter>(); }
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAny",
        corsPolicyBuilder => corsPolicyBuilder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin()
    );
});

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Policies.StylistsOrManagers,
        policy =>
        {
            policy.RequireAssertion(context
                => context.User.IsInRole(Roles.Stylist) || context.User.IsInRole(Roles.Manager)
            );
        })
    .AddPolicy(Policies.AppointmentAccess, policy =>
    {
        policy.RequireAssertion(context =>
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = context.User.FindFirstValue(ClaimTypes.Role);
            var appointment = context.Resource as AppointmentResponse; // Appointment passed during authorization
            return appointment != null &&
                   (userRole == Roles.Manager || appointment.StylistId.ToString() == userId ||
                    appointment.CustomerId.ToString() == userId);
        });
    })
    ;

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(context =>
    {
        var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (contextFeature != null)
        {
            logger.LogError(contextFeature.Error, "An error occurred");
        }

        return Task.CompletedTask;
    });
});

var serviceScope = app.Services.CreateScope();
var services = serviceScope.ServiceProvider;

var dbContext = services.GetRequiredService<AppDbContext>();
dbContext.Database.Migrate();

// Seed data
SeedData.Initialize(services);

app.UseCors("AllowAny");

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();