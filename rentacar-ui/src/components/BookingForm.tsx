import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Location {
  id: string;
  name: string;
  city: string;
}

const BookingForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [pickupLoc, setPickupLoc] = useState('');
  const [dropoffLoc, setDropoffLoc] = useState('');
  
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00');
  
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('09:00');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('/locations');
        setLocations(response.data);
        if (response.data.length > 0) {
          setPickupLoc(response.data[0].id);
          setDropoffLoc(response.data[0].id);
        }
      } catch (err) {
        console.error('Lokasyonlar yüklenemedi', err);
      }
    };
    fetchLocations();
  }, []);

  // Bugünün tarihi min tarih olsun
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Pazarları kısıtlamak için
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const dateStr = e.target.value;
    if (dateStr) {
      const date = new Date(dateStr);
      if (date.getDay() === 0) {
        alert(t('booking.sundayClosed') || 'Pazar günleri ofislerimiz kapalıdır. Lütfen başka bir gün seçin.');
        setter('');
        return;
      }
    }
    setter(dateStr);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLoc || !pickupDate || !dropoffDate) {
      alert(t('booking.fillRequired') || 'Lütfen gerekli tüm alanları doldurun.');
      return;
    }
    
    // Yönlendirme yap, parametreleri /search sayfasına taşı
    navigate(`/search?pickupLoc=${pickupLoc}&dropoffLoc=${dropoffLoc}&pickupDate=${pickupDate}T${pickupTime}&dropoffDate=${dropoffDate}T${dropoffTime}`);
  };

  // Zaman aralığı 09:00 - 17:00
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 9; i <= 17; i++) {
      const hourStr = i.toString().padStart(2, '0');
      options.push(`${hourStr}:00`);
      if (i !== 17) {
        options.push(`${hourStr}:30`);
      }
    }
    return options;
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Alış Yeri */}
          <div className="form-group mb-0">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <MapPin size={16} /> {t('booking.pickupLocation') || 'Alış Ofisi'}
            </label>
            <select className="form-control" value={pickupLoc} onChange={e => setPickupLoc(e.target.value)} required>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
              ))}
            </select>
          </div>

          {/* Teslim Yeri */}
          <div className="form-group mb-0">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <MapPin size={16} /> {t('booking.dropoffLocation') || 'Teslim Ofisi'}
            </label>
            <select className="form-control" value={dropoffLoc} onChange={e => setDropoffLoc(e.target.value)} required>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
              ))}
            </select>
          </div>

          {/* Alış Tarih ve Saat */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <Calendar size={16} /> {t('booking.pickupDate') || 'Tarih'}
              </label>
              <input 
                type="date" 
                className="form-control" 
                style={{ padding: '0.875rem 0.5rem' }}
                min={getMinDate()}
                value={pickupDate}
                onChange={e => handleDateChange(e, setPickupDate)}
                required 
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <Clock size={16} /> {t('booking.time') || 'Saat'}
              </label>
              <select className="form-control" value={pickupTime} onChange={e => setPickupTime(e.target.value)}>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teslim Tarih ve Saat */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <Calendar size={16} /> {t('booking.dropoffDate') || 'Tarih'}
              </label>
              <input 
                type="date" 
                className="form-control" 
                style={{ padding: '0.875rem 0.5rem' }}
                min={pickupDate || getMinDate()}
                value={dropoffDate}
                onChange={e => handleDateChange(e, setDropoffDate)}
                required 
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <Clock size={16} /> {t('booking.time') || 'Saat'}
              </label>
              <select className="form-control" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)}>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', gap: '0.75rem', width: '100%', justifyContent: 'space-between' }}>
            <span>{t('booking.searchCars') || 'Araç Bul'}</span>
            <Search size={20} /> 
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
