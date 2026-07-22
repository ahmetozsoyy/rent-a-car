# Rent A Car Yönetim ve Müşteri Hizmeti

Bu proje, modern web teknolojileri kullanilarak gelistirilmis kapsamli bir arac kiralama ve yonetim sistemidir. Sistem; yoneticiler (Admin), sube yoneticileri (Moderator) ve musteriler (User) icin ozel olarak tasarlanmis yetki tabanli bir yapi sunmaktadir.

## Kullanilan Teknolojiler ve Araclar

### Arka Uc (Backend)
- **.NET 8 (C#):** Performansli ve guvenli web API gelistirmek icin temel platform.
- **ASP.NET Core Web API:** RESTful API mimarisinin uygulandigi framework.
- **Entity Framework Core:** Veritabani islemleri icin kullanilan ORM (Object-Relational Mapper) araci. Code-First yaklasimi benimsenmistir.
- **PostgreSQL:** Iliskisel veritabani yonetim sistemi.
- **SignalR:** Gercek zamanli cift yonlu iletisim saglamak icin (canli destek hatti ve anlik bildirimler) kullanilmistir.
- **JWT (JSON Web Token):** Kimlik dogrulama (Authentication) ve yetkilendirme (Authorization) islemleri icin guvenli token tabanli yapi.
- **BCrypt.Net-Next:** Kullanici sifrelerinin guvenli bir sekilde hashlendigi kutuphane.
- **Swagger / OpenAPI:** API uclarinin test edilmesi ve dokumante edilmesi icin entegre edilmistir.

### On Uc (Frontend)
- **React (v18):** Bilesen tabanli modern kullanici arayuzu gelistirme kutuphanesi.
- **TypeScript:** JavaScript'e statik tip denetimi ekleyerek daha guvenilir ve yonetilebilir kod yazilmasini saglar.
- **Vite:** Hizli derleme ve gelistirme sunucusu amaciyla kullanilan modern build araci.
- **Zustand:** Projedeki global durum (state) yonetimini saglayan hafif ve hizli kutuphane. (Kimlik dogrulama ve bildirim state'leri icin kullanildi)
- **React Router DOM:** Tek sayfa uygulamasi (SPA) icerisindeki yonlendirme (routing) mekanizmasi.
- **Axios:** RESTful API'ler ile asenkron HTTP iletisimi saglar (JWT token interceptor yapisi ile desteklenmistir).
- **Vanilla CSS:** Projede herhangi bir harici CSS framework'u (Tailwind, Bootstrap vb.) kullanilmadan, ozel CSS degiskenleri ve modern teknikler (Glassmorphism, Flexbox, CSS Grid) ile tasarim insa edilmistir.

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

## Ozet

Sistem, hem sirket ici operasyonlarin yonetimini (arac bloklama, sube bazli raporlama) hem de musteri deneyimini (hizli kiralama, ek hizmetler secimi) sorunsuz bir sekilde entegre etmeyi hedefler. Tamamen modern ve olceklenmeye musait bir altyapi ile kurgulanmistir.
