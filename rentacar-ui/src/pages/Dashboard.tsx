import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, CalendarDays, History, Settings, LogOut, ChevronRight, MapPin, Clock, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock Data
  const activeReservations = [
    {
      id: '1',
      pnr: 'X7A9B2',
      vehicle: 'Mercedes S-Class',
      image: '/images/vehicles/mercedesyeni.jpg',
      pickupDate: '24 Tem 2026 09:00',
      dropoffDate: '27 Tem 2026 09:00',
      pickupLocation: 'İstanbul Havalimanı',
      dropoffLocation: 'İstanbul Havalimanı',
      status: 'Onaylandı',
      price: '18.500'
    }
  ];

  const pastReservations = [
    {
      id: '2',
      pnr: 'M4C1Z8',
      vehicle: 'BMW 5 Series',
      image: '/images/vehicles/bmw-5.jpg',
      pickupDate: '10 Haz 2026 10:00',
      dropoffDate: '12 Haz 2026 10:00',
      pickupLocation: 'Sabiha Gökçen Havalimanı',
      dropoffLocation: 'Sabiha Gökçen Havalimanı',
      status: 'Tamamlandı',
      price: '8.200'
    }
  ];

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
          
          {/* Sol Kolon - Profil Menüsü (Span 4) */}
          <div style={{ gridColumn: 'span 4' }}>
            <div style={{ background: '#FFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 12px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)', position: 'sticky', top: '7rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #000 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                  A
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>Ahmet Özsoy</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>ahmet@example.com</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => setActiveTab('active')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '10px', background: activeTab === 'active' ? 'var(--bg-main)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'active' ? 600 : 500, color: activeTab === 'active' ? 'var(--text-main)' : 'var(--text-muted)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CalendarDays size={18} /> Aktif Rezervasyonlar</div>
                  <ChevronRight size={16} />
                </button>
                
                <button 
                  onClick={() => setActiveTab('history')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '10px', background: activeTab === 'history' ? 'var(--bg-main)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'history' ? 600 : 500, color: activeTab === 'history' ? 'var(--text-main)' : 'var(--text-muted)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><History size={18} /> Geçmiş Kiralamalar</div>
                  <ChevronRight size={16} />
                </button>

                <button 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, color: 'var(--text-muted)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={18} /> Profil Bilgilerim</div>
                </button>

                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }} />

                <button 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, color: '#ef4444' }}
                >
                  <LogOut size={18} /> Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - İçerik Alanı (Span 8) */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-main)', margin: 0 }}>
                {activeTab === 'active' ? 'Aktif Rezervasyonlarım' : 'Geçmiş Kiralamalarım'}
              </h1>
            </div>

            {/* Rezervasyon Kartları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(activeTab === 'active' ? activeReservations : pastReservations).map((res) => (
                <div key={res.id} style={{ background: '#FFF', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 12px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.04)'; }}>
                  
                  {/* Kart Üst Bilgi (PNR & Status) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>PNR Kodu:</span>
                      <span className="technical-data" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.05em' }}>{res.pnr}</span>
                    </div>
                    <div style={{ background: activeTab === 'active' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: activeTab === 'active' ? '#16a34a' : '#4b5563', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {res.status}
                    </div>
                  </div>

                  {/* Araç ve Tarih Detayları */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', alignItems: 'center' }}>
                    
                    {/* Görsel */}
                    <div style={{ gridColumn: 'span 5' }}>
                      <img src={res.image} alt={res.vehicle} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </div>

                    {/* Detaylar */}
                    <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>{res.vehicle}</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <div style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}><MapPin size={16} color="var(--primary)"/></div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Alış</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{res.pickupLocation}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.pickupDate}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <div style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}><MapPin size={16} color="var(--primary)"/></div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Teslim</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{res.dropoffLocation}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.dropoffDate}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Alt Kısım - Tutar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Toplam Tutar:</span>
                      <span className="technical-data" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>₺{res.price}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
