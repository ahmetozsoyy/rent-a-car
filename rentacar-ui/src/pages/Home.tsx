import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-8">
      <div className="text-center">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
        
        <BookingForm />
      </div>
    </div>
  );
};

export default Home;
