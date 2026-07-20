import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { IVehicle } from '../types/vehicle';

// Showroom için ekstra teknik veriler
const getTechnicalSpecs = (brand: string, model: string) => {
  const name = `${brand} ${model}`.toLowerCase();
  
  if (name.includes('egea')) return { hp: '95 HP', engine: '1.3 Multijet', accel: '11.8s', maxSpeed: '181 km/s' };
  if (name.includes('corolla')) return { hp: '122 HP', engine: '1.8 Hybrid', accel: '10.9s', maxSpeed: '180 km/s' };
  if (name.includes('polo')) return { hp: '95 HP', engine: '1.0 TSI', accel: '10.8s', maxSpeed: '187 km/s' };
  if (name.includes('t-roc') || name.includes('troc')) return { hp: '150 HP', engine: '1.5 TSI', accel: '8.6s', maxSpeed: '205 km/s' };
  if (name.includes('rifter') || name.includes('peugeot')) return { hp: '100 HP', engine: '1.5 BlueHDi', accel: '12.5s', maxSpeed: '170 km/s' };
  if (name.includes('bmw')) return { hp: '170 HP', engine: '1.6 TwinPower', accel: '8.3s', maxSpeed: '226 km/s' };
  if (name.includes('mercedes')) return { hp: '286 HP', engine: '3.0 V6', accel: '6.0s', maxSpeed: '250 km/s' };
  if (name.includes('audi')) return { hp: '204 HP', engine: '40 TDI', accel: '7.4s', maxSpeed: '235 km/s' };
  
  return { hp: '110 HP', engine: '1.5L', accel: '10.5s', maxSpeed: '190 km/s' };
};

const Fleet: React.FC = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        // Sadece benzersiz marka/modelleri göster
        const uniqueVehicles = response.data.reduce((acc: IVehicle[], current: IVehicle) => {
          const exists = acc.find(item => item.brand === current.brand && item.model === current.model);
          if (!exists) return acc.concat([current]);
          return acc;
        }, []);
        setVehicles(uniqueVehicles);
      } catch (err) {
        console.error('Araçlar yüklenemedi', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '8rem' }}>
      
      {/* Header */}
      <div className="container" style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h1 className="display-title" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Filomuz</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Şirketimize ait seçkin araç koleksiyonunu inceleyin. Her bir araç, mükemmeliyet tutkumuzun bir yansımasıdır.
        </p>
      </div>

      {/* Editorial List */}
      <div>
        {loading ? (
          <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Yükleniyor...</div>
        ) : (
          vehicles.map((vehicle, index) => {
            const isEven = index % 2 === 0;
            const specs = getTechnicalSpecs(vehicle.brand, vehicle.model);
            
            return (
              <div key={vehicle.id} style={{ 
                display: 'flex', 
                flexDirection: isEven ? 'row' : 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6rem',
                gap: '3rem',
                padding: '0 5%'
              }}>
                {/* Image Side */}
                <div style={{ 
                  flex: 1, 
                  position: 'relative', 
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '10px solid #FFF',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.08)'
                }}>
                  <img 
                    src={vehicle.imageUrl || '/images/vehicles/placeholder.jpg'} 
                    alt={`${vehicle.brand} ${vehicle.model}`} 
                    style={{ 
                      width: '100%', 
                      height: '380px', 
                      objectFit: 'cover',
                      filter: 'grayscale(5%) contrast(105%)',
                      transition: 'transform 0.7s var(--ease-spring)',
                      display: 'block'
                    }} 
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                {/* Content Side */}
                <div style={{ flex: 1, padding: isEven ? '0 0 0 2rem' : '0 2rem 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{vehicle.bodyType}</span>
                    <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--text-muted)', opacity: 0.5 }}></div>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{vehicle.transmission}</span>
                  </div>
                  
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                    {vehicle.brand} <span style={{ color: 'var(--text-muted)' }}>{vehicle.model}</span>
                  </h2>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: 1.6 }}>
                    Gelişmiş mühendislik ve seçkin tasarım detayları ile sınıfının en kaliteli deneyimini sunuyor.
                  </p>

                  {/* Technical Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Motor</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{specs.engine}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Güç</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{specs.hp}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>0-100 km/s</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{specs.accel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Maks Hız</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{specs.maxSpeed}</div>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Fleet;
