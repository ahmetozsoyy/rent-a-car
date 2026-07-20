import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import type { IVehicle } from '../types/vehicle';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/VehicleCardSkeleton';

const Fleet: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles();
        setVehicles(data);
      } catch (err: any) {
        setError('Araçlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container pb-8" style={{ paddingTop: '8rem' }}>
      
      {/* Header & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>{t('fleet.title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px' }}>{t('fleet.subtitle')}</p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="form-group" style={{ position: 'relative', marginBottom: 0 }}>
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder={t('fleet.searchPlaceholder')}
              style={{ paddingLeft: '3.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="text-center" style={{ color: 'var(--error)' }}>{error}</div>}

      {/* Grid or Empty State */}
      <div className="fleet-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={idx === 0 ? "md:col-span-2" : ""}>
              <VehicleCardSkeleton />
            </div>
          ))
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle, idx) => (
            <div key={vehicle.id} className={idx === 0 ? "md:col-span-2" : ""} style={idx === 0 ? { display: 'flex' } : {}}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem 0', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
            {t('fleet.noVehicles')}
          </div>
        )}
      </div>

    </div>
  );
};

export default Fleet;
