import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="split-layout">
      {/* Left Content Area */}
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
      
      {/* Right Image Area */}
      <div style={{
        backgroundImage: 'url(/images/vehicles/bmw-5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}>
        {/* Subtle shadow on the edge where it meets the form */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120px',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)'
        }}></div>
      </div>
    </div>
  );
};

export default Home;
