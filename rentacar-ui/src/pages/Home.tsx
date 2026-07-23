import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { Shield, Building2 } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="page-enter home-hero-container">
      {/* Left Content Area (Smooth Fade Overlay) */}
      <div className="home-content-overlay">
        
        <div style={{ maxWidth: '650px', marginBottom: '3rem' }}>
          <h1 className="display-title">{t('home.title')}</h1>
          <p style={{ marginTop: '1.5rem', maxWidth: '500px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            {t('home.subtitle')}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/demo-admin" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
              <Shield size={18} /> Admin Paneli Simülasyonu
            </Link>
            <Link to="/demo-moderator" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
              <Building2 size={18} /> Şube Paneli Simülasyonu
            </Link>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            * Bu simülasyon panelleri sadece arayüzü incelemek/test etmek amaçlıdır, işlem yapılamaz.
          </div>
        </div>
        
        {/* Entegrasyon: Booking Form as a minimalist block */}
        <div style={{ width: '100%', maxWidth: '750px' }}>
          <BookingForm />
        </div>
        
      </div>
      
      {/* Right Image Area (Now just a transparent spacer since bg is on parent) */}
      <div className="home-right-spacer">
      </div>

      {/* Signature at the bottom of the existing page (centered on the whole screen) */}
      <div className="home-signature">
        <img src="/images/vehicles/imza.png" alt="İmza" style={{ maxHeight: '180px', opacity: 0.9 }} />
      </div>
    </div>
  );
};

export default Home;
