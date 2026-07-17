using RentACar.Application.Common.Interfaces;
using StackExchange.Redis;

namespace RentACar.Infrastructure.Services;

public class RedisDistributedLockService : IDistributedLockService
{
    private readonly IConnectionMultiplexer _redis;

    public RedisDistributedLockService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> AcquireLockAsync(string resourceKey, TimeSpan expiryTime)
    {
        var db = _redis.GetDatabase();
        // SetNX (StringEx) logic: returns true if key was set (didn't exist), false if it already existed
        return await db.StringSetAsync(resourceKey, "LOCKED", expiryTime, When.NotExists);
    }

    public async Task ReleaseLockAsync(string resourceKey)
    {
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync(resourceKey);
    }
}
