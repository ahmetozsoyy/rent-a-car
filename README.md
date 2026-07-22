# Rent A Car Yönetim ve Müşteri Hizmeti

Bu proje, modern web teknolojileri kullanilarak gelistirilmis kapsamli bir arac kiralama ve yonetim sistemidir. Sistem; yoneticiler (Admin), sube yoneticileri (Moderator) ve musteriler (User) icin ozel olarak tasarlanmis yetki tabanli bir yapi sunmaktadir.

**Website**
https://rent-a-car-iota-peach.vercel.app/

## Kullanilan Teknolojiler ve Araclar

### Backend
- **.NET 8 (C#)**
- **ASP.NET Core Web API** RESTful API
- **Entity Framework Core** Veritabani islemleri icin kullanilan ORM (Object-Relational Mapper) araci. Code-First yaklasimi benimsenmistir.
- **PostgreSQL-Docker**
- **SignalR** Gercek zamanli cift yonlu iletisim saglamak icin (canli destek hatti ve anlik bildirimler) kullanilmistir.
- **JWT (JSON Web Token)** Kimlik dogrulama (Authentication) ve yetkilendirme (Authorization) islemleri icin guvenli token tabanli yapi.
- **BCrypt.Net-Next** Kullanici sifrelerinin guvenli bir sekilde hashlendigi kutuphane.
- **Swagger / OpenAPI** API uclarinin test edilmesi ve dokumante edilmesi icin entegre edilmistir.

### Frontend
- **React (v18)** 
- **TypeScript** 
- **Vite** 
- **Zustand** Kimlik dogrulama ve bildirim state'leri icin kullanildi.
- **React Router DOM** Tek sayfa uygulamasi (SPA) icerisindeki yonlendirme (routing) mekanizmasi.
- **Axios** RESTful API'ler ile asenkron HTTP iletisimi saglar (JWT token interceptor yapisi ile desteklenmistir).
- **Vanilla CSS** 

## Mimari ve Sistem Yapisi

1. **Katmanli Yapi (Layered Architecture):**
   - Proje, veritabani modelleri, veri transfer objeleri (DTOs) ve denetleyiciler (Controllers) arasinda net bir ayrim yapilarak tasarlanmistir.
   
2. **Rol Tabanli Erisim Kontrolu (RBAC):**
   - **Admin:** Tum sistemi, subeleri, araclari ve moderatatorleri yonetebilir.
   - **Moderator:** Sadece kendine atanan subedeki ayarlari, araclari ve rezervasyonlari yonetebilir.
   - **User:** Arama yapabilir, arac kiralayabilir ve sistemde islem yapabilir.
   - Controller seviyesinde JWT Claim okumalari ile yetki sinirlamalari uygulanmaktadir.

3. **Gercek Zamanli Iletisim (Real-Time Communication):**
   - SignalR hub'lari uzerinden WebSockets mimarisi kullanilarak, sisteme dusen rezervasyonlar veya gonderilen mesajlar F5 (sayfa yenileme) gereksinimi olmadan istemcilere anlik olarak aktarilir.

4. **Guvenlik (Security):**
   - CORS politikalari spesifik olarak ayarlanmistir.
   - Hassas veriler (Sifreler) dogrudan veritabaninda saklanmaz, hashlenerek tutulur.
   - Yetkisiz istekler (401 Unauthorized) ve yetki disi istekler (403 Forbidden) HTTP standartlarina uygun olarak yonetilir.

## Ozet ve Temel Algoritmalar

Sistem, hem sirket ici operasyonlarin yonetimini (arac bloklama, sube bazli raporlama) hem de musteri deneyimini (hizli kiralama, ek hizmetler secimi) sorunsuz bir sekilde entegre etmeyi hedefler. Tamamen modern ve olceklenmeye musait bir altyapi ile kurgulanmistir.

Projenin altyapisinda kullanilan bazi kritik algoritmalar ve is mantiklari sunlardir:

- **Cakisan Rezervasyon Engelleme (Conflict Prevention):** Bir kullanici bir araci belirli tarihler arasi icin ayirdiginda, baska bir kullanicinin arama sonuclarinda veya kiralama asamasinda bu araci ayni tarihlerde gormesi engellenir. Veritabani seviyesindeki kontroller (Concurrency/Check) ile ayni aracin ayni anda iki kisi tarafindan tutulmasi (Double Booking) tamamen onlenmistir.
- **Dinamik Fiyatlandirma ve Ek Hizmetler:** Kullanicinin sectigi gun sayisina bagli olarak total ucret dinamik olarak hesaplanir. Ekstra kiralama hizmetleri (Bebek Koltugu, Ek Sigorta vb.) secildiginde, secilen gun sayisiyla carpilarak sepete (Checkout) es zamanli olarak yansitilir.
- **Arac Blokaj ve Bakim Algoritmasi:** Yoneticiler ve sube calisanlari bir araci periyodik bakim veya ariza sebebiyle belirli tarihler arasinda "Yayindan Kaldirabilir". Bu durumda arac blokaj tablolarinda isaretlenir ve musteri arama sonuclarinda gosterilmez.
- **Lokasyon Bazli Arac Takibi:** Aracin "Alis" lokasyonunun aracin anlik bulundugu lokasyonla (CurrentLocationId) eslesmesi zorunlulugu vardir. Eger kullanici araci kiralayip baska bir sehirdeki subeye (Iade) teslim ederse, sistem aracin yeni konumunu otomatik guncelleyerek baska musteriler icin yeni lokasyonundan rezerve edilebilir hale getirir.
