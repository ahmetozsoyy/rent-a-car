import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import type { IVehicle } from '../types/vehicle';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/VehicleCardSkeleton';

const SearchResults: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const pickupDate = searchParams.get('pickupDate');
        const dropoffDate = searchParams.get('dropoffDate');

        let data;
        if (pickupDate && dropoffDate) {
          data = await vehicleService.getAvailableVehicles(pickupDate, dropoffDate);
        } else {
          data = await vehicleService.getAllVehicles();
        }
        
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
    <div className="container pb-8 page-enter" style={{ paddingTop: '8rem' }}>
      
      {/* Header & Search */}
      <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="display-title" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Müsait Araçlar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Seçtiğiniz tarihlerde kiralamaya uygun kaliteli araçlarımız.</p>
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

      {/* Uniform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Skeletons
          [...Array(6)].map((_, i) => (
            <div key={i}>
              <VehicleCardSkeleton />
            </div>
          ))
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} style={{ transition: 'all 0.3s ease-in-out' }}>
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

export default SearchResults;
