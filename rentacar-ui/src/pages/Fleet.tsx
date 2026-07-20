import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { IVehicle } from '../types';

// Showroom için ekstra teknik veriler
const getTechnicalSpecs = (brand: string, model: string) => {
  const name = `${brand} ${model}`.toLowerCase();
  
  if (name.includes('egea')) return { hp: '130 HP', engine: '1.6 Multijet', accel: '9.8s', maxSpeed: '200 km/s' };
  if (name.includes('corolla')) return { hp: '122 HP', engine: '1.8 Hybrid', accel: '10.9s', maxSpeed: '180 km/s' };
  if (name.includes('polo')) return { hp: '95 HP', engine: '1.0 TSI', accel: '10.8s', maxSpeed: '187 km/s' };
  if (name.includes('t-roc') || name.includes('troc')) return { hp: '150 HP', engine: '1.5 TSI', accel: '8.6s', maxSpeed: '205 km/s' };
  if (name.includes('bmw 5')) return { hp: '252 HP', engine: '2.0 TwinPower', accel: '6.4s', maxSpeed: '250 km/s' };
  if (name.includes('mercedes')) return { hp: '286 HP', engine: '3.0 V6', accel: '6.0s', maxSpeed: '250 km/s' };
  if (name.includes('audi')) return { hp: '204 HP', engine: '40 TDI', accel: '7.4s', maxSpeed: '235 km/s' };
  
  return { hp: '150 HP', engine: '2.0L', accel: '8.5s', maxSpeed: '210 km/s' };
};

const Fleet: React.FC = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        console.error('Araçlar yüklenemedi', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '8rem' }}>
      
      {/* Header */}
      <div className="container" style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h1 className="display-title" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>The Gallery</h1>
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
                marginBottom: '8rem',
                gap: '4rem',
                padding: '0 5%'
              }}>
                {/* Image Side */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={vehicle.imageUrl || '/images/vehicles/placeholder.jpg'} 
                    alt={`${vehicle.brand} ${vehicle.model}`} 
                    style={{ 
                      width: '100%', 
                      height: '500px', 
                      objectFit: 'cover',
                      filter: 'grayscale(15%) contrast(110%)',
                      transition: 'transform 0.7s var(--ease-spring)'
                    }} 
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                {/* Content Side */}
                <div style={{ flex: 1, padding: isEven ? '0 0 0 4rem' : '0 4rem 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{vehicle.type}</span>
                    <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--text-muted)', opacity: 0.5 }}></div>
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{vehicle.transmission}</span>
                  </div>
                  
                  <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '1rem' }}>
                    {vehicle.brand} <span style={{ color: 'var(--text-muted)' }}>{vehicle.model}</span>
                  </h2>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '400px', lineHeight: 1.6 }}>
                    Gelişmiş mühendislik ve premium tasarım detayları ile sınıfının en seçkin deneyimini sunuyor.
                  </p>

                  {/* Technical Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Motor</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{specs.engine}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Güç</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{specs.hp}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>0-100 km/s</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{specs.accel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Maks Hız</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{specs.maxSpeed}</div>
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
