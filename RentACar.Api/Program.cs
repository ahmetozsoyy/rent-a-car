using Microsoft.EntityFrameworkCore;
using RentACar.Infrastructure.Persistence;
using RentACar.Application;
using RentACar.Application.Common.Interfaces;
using RentACar.Api.Middlewares;
using Hangfire;
using Hangfire.PostgreSql;
using StackExchange.Redis;
using RentACar.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Application Services
builder.Services.AddApplicationServices();

// PostgreSQL Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
    
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// Redis Connection
var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection");
builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString!));
builder.Services.AddScoped<IDistributedLockService, RedisDistributedLockService>();

// Hangfire Settings
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(c => c.UseNpgsqlConnection(connectionString)));

builder.Services.AddHangfireServer();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Custom Middlewares
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Hangfire Dashboard
app.UseHangfireDashboard();

app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
        await ApplicationDbContextSeed.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı migration veya seed sırasında hata oluştu.");
    }
}

app.Run();
