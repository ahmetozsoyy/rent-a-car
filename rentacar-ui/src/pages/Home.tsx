import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="split-layout page-enter" style={{
      backgroundImage: 'linear-gradient(to right, var(--bg-main) 0%, var(--bg-main) 20%, transparent 50%), url(/images/vehicles/mercedesyeni.jpg)',
      backgroundSize: '100% 100%, auto 100%',
      backgroundPosition: 'left center, right center',
      backgroundRepeat: 'no-repeat, no-repeat',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Left Content Area (Smooth Fade Overlay) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '8rem 4rem 4rem 4rem',
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 75%, transparent 100%)',
        maskImage: 'linear-gradient(to right, black 0%, black 75%, transparent 100%)',
        width: '120%',
        minHeight: '100vh',
        zIndex: 2
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
