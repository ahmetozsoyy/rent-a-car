# Runtime için baz imaj (Sadece uygulamayı çalıştırmak için gerekli minimal .NET 8 ortamı)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Render.com ve çoğu modern platform genelde 8080 portunu bekler
EXPOSE 8080
EXPOSE 8081

# Derleme ortamı (SDK içerir)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Önce sadece .csproj dosyalarını kopyalayıp bağımlılıkları yüklüyoruz (Docker Cache'ini verimli kullanmak için)
COPY ["RentACar.Api/RentACar.Api.csproj", "RentACar.Api/"]
COPY ["RentACar.Application/RentACar.Application.csproj", "RentACar.Application/"]
COPY ["RentACar.Domain/RentACar.Domain.csproj", "RentACar.Domain/"]
COPY ["RentACar.Infrastructure/RentACar.Infrastructure.csproj", "RentACar.Infrastructure/"]
RUN dotnet restore "RentACar.Api/RentACar.Api.csproj"

# Tüm kodları kopyala ve derle
COPY . .
WORKDIR "/src/RentACar.Api"
RUN dotnet build "RentACar.Api.csproj" -c Release -o /app/build

# Yayınlama (Publish) işlemi
FROM build AS publish
RUN dotnet publish "RentACar.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Son üretim imajı (Production Image)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Çevresel değişkenleri Production'a ayarla
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "RentACar.Api.dll"]
