# Veritabanı Şeması ve Durum Makinesi (State Machine)

## Varlıklar (Entities)
- **User:** Müşteri ve yönetici hesapları.
- **Location:** Ofisler/garajlar (Adres, şehir ve kapasite bilgisi).
- **Vehicle:** Araçlar (Marka, model, yıl, segment, mevcut lokasyon ID, günlük taban fiyat `DailyPrice`, `RowVersion` için timestamp/xmin optimistic concurrency alanı).
- **RentalExtra:** Kiralamaya eklenebilecek ek hizmetler (Ad, günlük/sabit fiyat - Örn: Kasko, Bebek Koltuğu, Navigasyon).
- **Reservation:** Kiralama kayıtları (Kullanıcı ID, Araç ID, Alış Lokasyon ID, Teslim Lokasyon ID, Başlangıç Tarihi, Bitiş Tarihi, Toplam Fiyat, Statü, Oluşturulma Tarihi).
- **ReservationExtra:** Rezervasyona seçilen ek hizmetlerin ara bağlantı tablosu (Many-to-Many ilişki için).

## Reservation Status (Durum Makinesi)
Bir rezervasyon sadece şu statülerde olabilir ve sıralı geçişlere tabidir:
1. `PENDING` -> Kullanıcı aracı seçti, ödeme bekleniyor (15 dk kilidi aktif).
2. `CONFIRMED` -> Ödeme alındı, araç kesinleşti.
3. `ACTIVE` -> Araç müşteriye teslim edildi, kullanımda.
4. `COMPLETED` -> Araç ofise teslim edildi, kiralama bitti.
5. `CANCELLED` -> Kullanıcı veya admin tarafından iptal edildi.
6. `EXPIRED` -> 15 dakika içinde ödeme yapılmadı, Hangfire aracı serbest bıraktı.
