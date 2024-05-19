
using AutoMapper;
using Azure.Storage.Blobs;
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Context;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace GRDB.ServerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var configuration = builder.Configuration;
            builder.Logging.AddConsole();

            var host = builder.Configuration["DBHOST"];
            var port = builder.Configuration["DBPORT"];
            var user = builder.Configuration["DBUSER"];
            var password = builder.Configuration["DBPASSWORD"];
            var database = builder.Configuration["DBNAME"];

            builder.Services.AddCors(policy =>
            {
                policy.AddPolicy("CorsAllAccessPolicy", opt =>
                opt.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());
            });

            var connectionString = $"Server={host},{port};Database={database};User Id={user};Password={password};TrustServerCertificate=True;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=False;";

            //var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<GrdbContext>(options => options.UseSqlServer(connectionString));

            ConfigureAutoMapper(builder.Services);

            builder.Services.AddScoped<IDbService, DbService>();
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton(x => new BlobServiceClient("DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://storage:10000/devstoreaccount1;QueueEndpoint=http://storage:10001/devstoreaccount1;"));

            builder.Services.AddIdentity<GrdbUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
            })
                .AddEntityFrameworkStores<GrdbContext>()
                .AddDefaultTokenProviders();


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]))
                };
            });


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "GRDB Database", Version = "v1" });

                // Define JWT bearer token authentication
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Description = "JWT Authorization header using the Bearer scheme",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                };
                c.AddSecurityDefinition("Bearer", securityScheme);

                // Make sure Swagger UI requires a Bearer token
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });


            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<GrdbContext>();
                InitializeDatabase(dbContext);
            }

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("CorsAllAccessPolicy");
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }


        static void ConfigureAutoMapper(IServiceCollection services)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<BookAuthor, AuthorDTO>().ReverseMap();
                cfg.CreateMap<BookAuthor, AuthorCreateDTO>().ReverseMap();
                cfg.CreateMap<BookGenre, GenreDTO>().ReverseMap();
                cfg.CreateMap<BookGenre, GenreCreateDTO>().ReverseMap();
                cfg.CreateMap<BookAuthorConnection, BookAuthorConnectionDTO>().ReverseMap();
                cfg.CreateMap<BookAuthorConnection, AuthorDTO>().ReverseMap();
                cfg.CreateMap<BookGenreConnection, BookGenreConnectionDTO>().ReverseMap();
                cfg.CreateMap<BookGenreConnection, GenreDTO>().ReverseMap();
                cfg.CreateMap<BookReview, BookReviewDTO>().ReverseMap();
                cfg.CreateMap<BookReview, BookReviewCreateDTO>().ReverseMap();
                cfg.CreateMap<BookReview, BookReviewUpdateDTO>().ReverseMap();
                cfg.CreateMap<GrdbUser, GrdbUserDTO>().ReverseMap();
                cfg.CreateMap<GrdbUser, GrdbUserCreateDTO>().ReverseMap();
                cfg.CreateMap<GrdbUser, GrdbUserUpdateDTO>().ReverseMap();           
                cfg.CreateMap<Book, BookCreateDTO>().ReverseMap();
                cfg.CreateMap<Book, BookUpdateDTO>().ReverseMap();
                cfg.CreateMap<Book, BookDTO>().ReverseMap();
            });
            var mapper = config.CreateMapper();
            services.AddSingleton(mapper);
        }

        public static void InitializeDatabase(GrdbContext dbContext)
        {
            // Apply any pending migrations
            dbContext.Database.Migrate();

            // Add your custom initialization logic here
            // For example, you can seed initial data or create additional tables

            // Save the changes to the database
            dbContext.SaveChanges();
        }
    }
}
