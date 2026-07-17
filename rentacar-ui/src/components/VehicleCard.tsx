import React, { useState } from 'react';
import { VehicleSegment } from '../types/vehicle';
import type { IVehicle } from '../types/vehicle';
import { useTranslation } from 'react-i18next';
import { Settings, Fuel, ChevronRight, ChevronDown, ChevronUp, ShieldCheck, UserCheck, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: IVehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [insuranceType, setInsuranceType] = useState('standard');

  const segmentLabels: Record<number, string> = {
    [VehicleSegment.Economy]: 'Economy',
    [VehicleSegment.Compact]: 'Compact',
    [VehicleSegment.Standard]: 'Standard',
    [VehicleSegment.Premium]: 'Premium',
    [VehicleSegment.Luxury]: 'Luxury',
    [VehicleSegment.SUV]: 'SUV'
  };

  // Backend'den resim gelmiyorsa placeholder kullanalım
  const imageUrl = vehicle.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      {/* Vehicle Image */}
      <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={imageUrl} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 250ms ease-in-out' }}
          className="vehicle-img"
        />
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
          {segmentLabels[vehicle.segment]}
        </div>
      </div>
      
      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{vehicle.brand} {vehicle.model}</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{vehicle.year} Model</span>
          </div>
        </div>

        {/* Features Row */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={16} />
            <span>{vehicle.transmission === 'Manual' ? t('fleet.manual') || 'Manuel' : t('fleet.auto') || 'Otomatik'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Fuel size={16} />
            <span>{vehicle.fuelType === 'Diesel' ? t('fleet.diesel') || 'Dizel' : vehicle.fuelType === 'Petrol' ? t('fleet.petrol') || 'Benzin' : vehicle.fuelType}</span>
          </div>
        </div>

        <div style={{ flexGrow: 1 }}></div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.25rem 0' }} />

        {/* Price & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('fleet.dailyRate')}</span>
            <div className="technical-data" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ₺{vehicle.dailyPrice.toLocaleString('tr-TR')}
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isExpanded ? t('fleet.close') || 'Kapat' : t('fleet.rentNow') || 'Hemen Kirala'} 
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expanded Area */}
        <div style={{ 
          maxHeight: isExpanded ? '500px' : '0', 
          overflow: 'hidden', 
          transition: 'max-height 300ms ease-in-out',
          opacity: isExpanded ? 1 : 0,
        }}>
          <div style={{ paddingTop: '1.5rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Extra Specs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} />
                <span>{t('fleet.minAge')}: {vehicle.minDriverAge}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={16} />
                <span>{t('fleet.bodyType')}: {vehicle.bodyType}</span>
              </div>
            </div>

            {/* Insurance Selection */}
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('fleet.insuranceType')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="radio" name={`insurance-${vehicle.id}`} checked={insuranceType === 'standard'} onChange={() => setInsuranceType('standard')} />
                  {t('fleet.standardInsurance')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="radio" name={`insurance-${vehicle.id}`} checked={insuranceType === 'premium'} onChange={() => setInsuranceType('premium')} />
                  <ShieldCheck size={16} color="var(--primary)" />
                  {t('fleet.premiumInsurance')}
                </label>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => navigate('/checkout')}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {t('fleet.proceedCheckout')} <ChevronRight size={16} />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleCard;
