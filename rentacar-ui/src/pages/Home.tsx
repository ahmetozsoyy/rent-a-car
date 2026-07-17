import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-8">
      <div className="text-center">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="btn btn-primary">{t('home.browseFleet')}</button>
          <button className="btn btn-outline">{t('home.learnMore')}</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
