import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', marginTop: '-5rem' }}>
      {/* Hero Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/vehicles/bmw-5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -2
      }} />
      
      {/* Overlay - Dark gradient to make text pop */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 100%)',
        zIndex: -1
      }} />

      {/* Content Container */}
      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 1, 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '6rem' 
      }}>
        
        {/* Typography */}
        <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
          <h1 style={{ color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {t('home.title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', fontWeight: 400, maxWidth: '600px' }}>
            {t('home.subtitle')}
          </p>
        </div>
        
        {/* Booking Form Area */}
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <BookingForm />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
