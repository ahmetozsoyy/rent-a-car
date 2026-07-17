# Arayüz (UI/UX) ve Tasarım Sistemi Kuralları

## 1. Tasarım Felsefesi ve İlham Kaynakları
- **Kurumsal ve Premium Duruş:** Arayüz tasarımları kesinlikle **Mercedes-Benz Fleet Management, Tesla Fleet ve BMW ConnectedDrive** panellerinin sadeliğinden ve olgunluğundan ilham alacaktır.
- **Minimalizm:** Gereksiz görsel kalabalıktan uzak, yüksek kontrastlı, modern, şık ve bol boşluklu (whitespace) bir tasarım dili benimsenecektir.
- **Renk Paleti:** Koyu mod (Dark Mode) ağırlıklı veya slate/zinc tonlarının hakim olduğu, kurumsal mavi, titanyum gri ve şık metalik aksan renkleriyle desteklenmiş endüstriyel bir palet kullanılacaktır.

## 2. Tipografi (Font Standartları)
- **Ana Font:** Tüm arayüzde kesinlikle **Geist** font ailesi (Vercel Geist) kullanılacaktır.
- **Sayısal ve Teknik Veriler:** Araç plakaları, VIN kodları, kilometre bilgileri, fiyatlar ve tarih/saat sayaçlarında teknik ve nizami bir görünüm için **Geist Mono** kullanılacaktır.

## 3. Mikro Etkileşimler ve Animasyon Kuralları
- **Animasyon Süreleri:** Sayfa geçişleri, hover (üzerine gelme) efektleri, buton tetiklemeleri ve mikro etkileşimlerin süreleri strictly **150 ms – 250 ms** aralığında olacaktır. Asla yavaş, hantal veya dikkat dağıtıcı abartılı animasyonlar kullanılmayacaktır.
- **Easing (Geçiş Eğrileri):** Doğal ve pürüzsüz bir his için `ease-in-out` veya hassas ayarlanmış `cubic-bezier` geçişleri tercih edilecektir.
- **Hover ve Odak Etkileşimleri:** Kartlarda ve butonlarda sade ince kenarlık parlamaları (subtle border glow), hafif gölge değişimleri (soft elevation) ve zarif renk geçişleri olmalıdır.
- **Yükleme (Loading) Durumları:** Kaba yükleme dönenceleri (spinner) yerine, içerik yerleşimiyle birebir uyumlu, 150-250 ms ritminde nefes alan şık **Skeleton Loading (İskelet Yükleme)** animasyonları kullanılacaktır.
- **Veri Geribildirimi (Feedback):** İşlem başarı, hata ve uyarı bildirimleri (toast notifications) ekranı kaplamadan, köşeden zarifçe kayarak giren/çıkan sade paneller şeklinde olmalıdır.
