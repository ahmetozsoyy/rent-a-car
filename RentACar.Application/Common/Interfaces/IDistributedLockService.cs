namespace RentACar.Application.Common.Interfaces;

public interface IDistributedLockService
{
    Task<bool> AcquireLockAsync(string resourceKey, TimeSpan expiryTime);
    Task ReleaseLockAsync(string resourceKey);
}
