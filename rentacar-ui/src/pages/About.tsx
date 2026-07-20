import React from 'react';
import { Mail, Phone, MapPin, Award, ShieldCheck, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '8rem' }}>

      {/* Header */}
      <div className="container" style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h1 className="display-title" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Hakkımızda</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          1998'den beri lüks, güven ve konforu bir araya getirerek müşterilerimize unutulmaz sürüş deneyimleri sunuyoruz.
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1000px' }}>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '8rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>Vizyonumuz & Misyonumuz</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Kurulduğumuz ilk günden bu yana, sadece araç kiralamayı değil, baştan sona eksiksiz bir "mobilite deneyimi" yaşatmayı hedefliyoruz. Filomuzdaki her araç, en yüksek güvenlik ve konfor standartlarına göre özenle seçilip bakımdan geçirilmektedir.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Müşterilerimizin zamanının ne kadar değerli olduğunun farkındayız. Bu nedenle sıfır evrak karmaşası, anında teslimat ve 7/24 kesintisiz VIP destek sunarak sektördeki standartları her geçen gün daha da yukarı çekiyoruz.
            </p>
          </div>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '8px solid #FFF',
            height: '400px'
          }}>
            <img
              src="/images/vehicles/mercedes.jpg"
              alt="Şirket Vizyonu"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
            />
          </div>
        </div>

        {/* Features / Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '8rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
              <Award size={40} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Ödüllü Hizmet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Son 5 yılın en iyi müşteri memnuniyeti ödülüne sahip lüks araç kiralama firması.</p>
          </div>
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Tam Kapsamlı Güvenlik</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Tüm filomuz en üst düzey kasko ve sigorta paketleriyle güvence altındadır.</p>
          </div>
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
              <Clock size={40} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>7/24 Kesintisiz Destek</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Yolculuğunuzun her anında, ihtiyaç duyduğunuz her an yanınızdayız.</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass" style={{ padding: '4rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '2rem' }}>İletişim & Lokasyon</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Merkez Ofis</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>Barbaros Bulvarı, Nispetiye Mah. No:45<br />Beşiktaş, İstanbul</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                    <Phone size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Müşteri Hizmetleri</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>+90 (850) 123 45 67</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>E-Posta Adresi</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>ozsoyyahmett@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {/* Dummy Map Area */}
              <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '300px',
                backgroundColor: '#E5E7EB',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #FFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}>
                <div style={{ textAlign: 'center' }}>
                  <MapPin size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                  <div>Harita Görünümü</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
