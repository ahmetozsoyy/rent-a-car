# Teknik Standartlar ve Kodlama Kuralları (.NET 8/9 ASP.NET Core)

## 1. Teknoloji Yığıtı (Tech Stack)
- **Backend Dil & Framework:** C# 12+ / .NET 8 veya .NET 9 ASP.NET Core Web API.
- **Veritabanı:** PostgreSQL.
- **ORM:** Entity Framework Core (`Npgsql.EntityFrameworkCore.PostgreSQL`).
- **Önbellek & Dağıtık Kilit (Distributed Lock):** Redis (`StackExchange.Redis`).
- **Arka Plan İşleri (Background Jobs):** Hangfire (15 dakika kuralı ve zamanlanmış görevler için).
- **Doğrulama (Validation):** FluentValidation.
- **Test & Entegrasyon:** xUnit, WebApplicationFactory, Testcontainers (Docker üzerinden gerçek DB testi için).

## 2. Mimari Kurallar ve Katmanlar
- **Clean Architecture / N-Layer:** 
  - `API Layer`: Controllers/Endpoints, Middleware, Filters.
  - `Service/Business Layer`: İş mantığı, servis interface'leri (`IReservationService`, `IVehicleService`, `ICalculationService` vb.).
  - `Data/Repository Layer`: EF Core `DbContext`, Entity sınıfları, Configurations.
- **Dependency Injection (DI):** Tüm servisler `Program.cs` içerisinde DI container'a interface'leri ile kayıt edilecek. Asla `new` anahtar kelimesi ile servis instance'ı oluşturulmayacak.

## 3. Kodlama Standartları
- **Tamamen Asenkron (Async All The Way):** Tüm I/O, veritabanı ve servis metotları `async Task` veya `async Task<T>` olmalı. Metotlara mutlaka `CancellationToken cancellationToken` parametresi eklenmeli.
- **DTO ve Data Contracts:** Veritabanı entity'leri asla API dışına açılmamalıdır (No expose entities). İstek ve yanıtlar için immutable (değiştirilemez) C# `record` tipleri (DTOs) kullanılmalıdır.
- **Validation Pipeline:** Veri doğrulamaları sadece `FluentValidation` ile yapılmalı, Controller içinde `if/else` ile manuel validasyon yazılmamalıdır.
- **Global Exception Handling:** Hata yönetimi için ASP.NET Core Global Exception Handler Middleware kullanılmalı; iş mantığı hataları (`BusinessException`, `NotFoundException`, `ConflictException`) ilgili HTTP statü kodlarıyla (400, 404, 409 Conflict, 422) otomatik eşleştirilmelidir.
