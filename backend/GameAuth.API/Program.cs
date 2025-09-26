using GameAuth.API.Data;
using GameAuth.API.Services;
using GameAuth.API.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=gameauth.db"));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add services
builder.Services.AddScoped<IAuthService, AuthService>();

// Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Commented out for development

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<MessageHub>("/messageHub");

// Ensure database is created and seed test user
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    
    // Seed test users if not exists
    if (!context.Users.Any(u => u.Nickname == "admin"))
    {
        var testUser1 = new GameAuth.API.Models.User
        {
            PhoneNumber = "+1234567890",
            Nickname = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("adminpassword"),
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(testUser1);
    }

    if (!context.Users.Any(u => u.Nickname == "admin2"))
    {
        var testUser2 = new GameAuth.API.Models.User
        {
            PhoneNumber = "+1234567891",
            Nickname = "admin2",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("adminpassword2"),
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(testUser2);
    }

    context.SaveChanges();
}

app.Run();
