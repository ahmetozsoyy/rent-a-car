import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { IVehicle } from '../types/vehicle';
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

      {error && <div className="text-center" style={{ color: 'var(--error)' }}>{error}</div>}

      {/* Grid or Empty State */}
      <div className="fleet-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <VehicleCardSkeleton key={idx} />)
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            {t('fleet.noVehicles')}
          </div>
        )}
      </div>

    </div>
  );
};

export default Fleet;
