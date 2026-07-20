import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="split-layout home-split" style={{
      backgroundImage: 'url(/images/vehicles/mercedesyeni.jpg)',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'right center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Left Content Area (Glassmorphism Overlay) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '8rem 4rem 4rem 4rem',
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh',
        zIndex: 1
      }}>
        
        <div style={{ maxWidth: '650px', marginBottom: '4rem' }}>
          <h1 className="display-title">{t('home.title')}</h1>
          <p style={{ marginTop: '1.5rem', maxWidth: '500px' }}>
            {t('home.subtitle')}
          </p>
        </div>
        
        {/* Entegrasyon: Booking Form as a minimalist block */}
        <div style={{ width: '100%', maxWidth: '750px' }}>
          <BookingForm />
        </div>
        
      </div>
      
      {/* Right Image Area (Now just a transparent spacer since bg is on parent) */}
      <div style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}>
      </div>
    </div>
  );
};

export default Home;
