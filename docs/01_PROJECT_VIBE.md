# Proje: Standart ve Çakışma Korumalı Araç Kiralama Platformu

## 1. Vizyon
Bu proje; zaman çakışması önleme (concurrency control), geçici rezervasyon kilitleme ve araç filo alokasyonu içeren kurumsal seviyede bir ASP.NET Core REST API ve premium arayüz projesidir. Fiyatlandırma standart ve şeffaftır; odak noktası sistemin tutarlılığı, eşzamanlı isteklerde hatasız çalışması ve kullanıcı arayüzünün endüstri lideri (Mercedes, Tesla, BMW) standartlarında olmasıdır.

## 2. Temel İş Kuralları (Core Business Rules)
- **Asla Çakışma Olamaz (Zero Double-Booking):** Bir araç, belirli bir tarih aralığında onaylanmış (`CONFIRMED`) veya askıda (`PENDING`) bir rezervasyona sahipse, aynı tarihler arasında kesinlikle başkasına kiralanamaz. Redis Dağıtık Kilit (Distributed Lock) ve EF Core Optimistic Concurrency uygulanmalıdır.
- **15 Dakika Kuralı (Temporary Reservation Lock):** Bir kullanıcı araç ayırıp ödeme adımına geçtiğinde araç "PENDING" statüsüne alınır ve Hangfire üzerinde 15 dakikalık bir zamanlayıcı başlatılır. 15 dakika içinde ödeme onayı gelmezse Hangfire aracı otomatik olarak "EXPIRED" statüsüne çeker ve kilidi kaldırır.
- **Standart Fiyatlandırma Mantığı:** 
  - `Base Rental Fee`: Aracın günlük taban fiyatı (`DailyPrice`) x kiralanan gün sayısı.
  - `One-Way Fee`: Aracın alındığı ofis (`PickupLocation`) ile teslim edileceği ofis (`DropoffLocation`) farklıysa eklenen transfer bedeli.
  - `Extras`: Kullanıcının seçtiği ek hizmetler (Örn: Tam Kasko, Bebek Koltuğu, Ek Sürücü vb.) toplam tutara eklenir.
  - `Total Price` = `Base Rental Fee` + `One-Way Fee` + `Extras Total`
