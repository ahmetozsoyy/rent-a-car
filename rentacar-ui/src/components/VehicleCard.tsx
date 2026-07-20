import React from 'react';
import { VehicleSegment } from '../types/vehicle';
import type { IVehicle } from '../types/vehicle';
import { useTranslation } from 'react-i18next';
import { Settings, Fuel, ArrowRight, Car, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: IVehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const segmentLabels: Record<number, string> = {
    [VehicleSegment.Economy]: 'Economy',
    [VehicleSegment.Compact]: 'Compact',
    [VehicleSegment.Standard]: 'Standard',
    [VehicleSegment.Premium]: 'Premium',
    [VehicleSegment.Luxury]: 'Luxury',
    [VehicleSegment.SUV]: 'SUV'
  };

  const imageUrl = vehicle.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800';

  const handleSelect = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('vehicleId', vehicle.id);
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1rem', border: 'none', background: 'transparent', boxShadow: 'none' }}>
      
      {/* Vehicle Image Container */}
      <div style={{ 
        width: '100%', 
        height: '300px', 
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: 'var(--border-radius-soft)',
        backgroundColor: '#F0F0F0'
      }}>
        <img 
          src={imageUrl} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms var(--ease-spring)' }}
          className="vehicle-img"
        />
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          left: '1rem', 
          background: 'rgba(0,0,0,0.7)', 
          backdropFilter: 'blur(4px)', 
          padding: '0.4rem 0.8rem', 
          borderRadius: '4px', 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: '#FFF', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase' 
        }}>
          {segmentLabels[vehicle.segment]}
        </div>
      </div>
      
      {/* Content Area */}
      <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Title & Price Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {vehicle.brand} <span style={{ color: 'var(--text-muted)' }}>{vehicle.model}</span>
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{vehicle.year}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="technical-data" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
              ₺{vehicle.dailyPrice.toLocaleString('tr-TR')}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('fleet.dailyRate') || '/ Gün'}
            </span>
          </div>
        </div>

        {/* Specs Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={16} opacity={0.6} />
            <span>{vehicle.transmission === 'Manual' ? t('fleet.manual') || 'Manuel' : t('fleet.auto') || 'Otomatik'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Fuel size={16} opacity={0.6} />
            <span>{vehicle.fuelType === 'Diesel' ? t('fleet.diesel') || 'Dizel' : vehicle.fuelType === 'Petrol' ? t('fleet.petrol') || 'Benzin' : vehicle.fuelType}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={16} opacity={0.6} />
            <span>{vehicle.bodyType}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} opacity={0.6} />
            <span>Min {vehicle.minDriverAge} Yaş</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={handleSelect}
            className="btn btn-outline" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-soft)'
            }}
          >
            <span>{t('fleet.rentNow') || 'Seç ve İlerle'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default VehicleCard;
