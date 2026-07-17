import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const Fleet: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mt-8 pb-8">
      
      {/* Header & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="text-center">
          <h1 style={{ marginBottom: '0.5rem' }}>{t('fleet.title')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('fleet.subtitle')}</p>
        </div>
        
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder={t('fleet.searchPlaceholder')}
              style={{ paddingLeft: '3rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid or Empty State will go here */}
      <div className="fleet-grid">
        {/* Placeholder for now */}
      </div>

    </div>
  );
};

export default Fleet;
