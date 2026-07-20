import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { vehicleService } from '../services/vehicleService';
import type { IVehicle } from '../types/vehicle';
import { CreditCard, CheckCircle, CarFront, Users, ShieldCheck } from 'lucide-react';

interface RentalExtra {
  id: string;
  name: string;
  price: number;
  priceType: number;
}

interface Location {
  id: string;
  name: string;
  city: string;
}

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehicleId = searchParams.get('vehicleId');
  const pickupLocId = searchParams.get('pickupLoc');
  const dropoffLocId = searchParams.get('dropoffLoc');
  const pickupDateStr = searchParams.get('pickupDate');
  const dropoffDateStr = searchParams.get('dropoffDate');
  const insuranceQuery = searchParams.get('insurance');

  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [extras, setExtras] = useState<RentalExtra[]>([]);
  const [loading, setLoading] = useState(true);

  const [isForSomeoneElse, setIsForSomeoneElse] = useState(false);
  const [driverDetails, setDriverDetails] = useState({
    firstName: '',
    lastName: '',
    tcNo: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'CreditCard' | 'PayAtOffice'>('PayAtOffice');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);

  useEffect(() => {
    if (!vehicleId || !pickupLocId || !dropoffLocId || !pickupDateStr || !dropoffDateStr) {
      alert(t('checkout.missingParams') || 'Eksik rezervasyon bilgileri. Lütfen araç seçerek ilerleyin.');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [vehicleData, locData] = await Promise.all([
          vehicleService.getVehicleById(vehicleId),
          api.get('/locations')
        ]);
        setVehicle(vehicleData);
        setLocations(locData.data);
        
        try {
           const extrasData = await api.get('/rentalextras');
           setExtras(extrasData.data);
           
           if (insuranceQuery === 'premium') {
             const premiumExtra = extrasData.data.find((e: RentalExtra) => e.name.toLowerCase().includes('premium'));
             if (premiumExtra) {
               setSelectedExtraIds([premiumExtra.id]);
             }
           }
        } catch (e) {
           console.log("Extras alınamadı, boş bırakılıyor.");
        }

      } catch (err) {
        console.error('Veriler yüklenemedi', err);
        alert(t('checkout.loadError') || 'Araç bilgileri yüklenemedi.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vehicleId, pickupLocId, dropoffLocId, pickupDateStr, dropoffDateStr, insuranceQuery, navigate, t]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtraIds(prev => 
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };

  if (loading || !vehicle) return <div className="text-center" style={{ paddingTop: '10rem' }}>Yükleniyor...</div>;

  const pickupDate = new Date(pickupDateStr!);
  const dropoffDate = new Date(dropoffDateStr!);
  let days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 3600 * 24));
  if (days <= 0) days = 1;

  const pickupLocation = locations.find(l => l.id === pickupLocId);
  const dropoffLocation = locations.find(l => l.id === dropoffLocId);
  const isOneWay = pickupLocId !== dropoffLocId;

  let basePrice = vehicle.dailyPrice * days;
  let extrasTotal = 0;
  
  selectedExtraIds.forEach(id => {
    const extra = extras.find(e => e.id === id);
    if (extra) {
      extrasTotal += extra.priceType === 1 ? (extra.price * days) : extra.price;
    }
  });

  let totalBeforeDiscount = basePrice + extrasTotal + (isOneWay ? 1000 : 0);
  let discount = paymentMethod === 'CreditCard' ? totalBeforeDiscount * 0.15 : 0;
  let finalPrice = totalBeforeDiscount - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        userId: '11111111-1111-1111-1111-111111111111',
        vehicleId,
        pickupLocationId: pickupLocId,
        dropoffLocationId: dropoffLocId,
        startDate: pickupDate.toISOString(),
        endDate: dropoffDate.toISOString(),
        rentalExtraIds: selectedExtraIds,
        paymentMethod: paymentMethod === 'CreditCard' ? 2 : 1,
        ...(isForSomeoneElse ? {
          driverFirstName: driverDetails.firstName,
          driverLastName: driverDetails.lastName,
          driverTcNo: driverDetails.tcNo,
          driverPhone: driverDetails.phone
        } : {})
      };
      
      await api.post('/reservations', payload);
      alert('Rezervasyon başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Rezervasyon oluşturulurken hata oluştu.');
    }
  };

  return (
    <div className="split-layout">
      
      {/* Sol Kolon - Formlar (Aydınlık ve Minimal) */}
      <div style={{ padding: '8rem 10% 4rem 10%', backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '3rem', letterSpacing: '-0.04em' }}>{t('checkout.title') || 'Checkout'}</h1>
        
        <div className="flex flex-col gap-8">
          
          {/* Sürücü Bilgileri */}
          <div>
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 500 }}><Users size={20} opacity={0.5}/> Sürücü Bilgileri</h3>
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer" style={{ fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={isForSomeoneElse} 
                  onChange={e => setIsForSomeoneElse(e.target.checked)} 
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                />
                Başkası adına kiralıyorum
              </label>
            </div>

            {isForSomeoneElse ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Ad</label>
                  <input type="text" className="form-control" value={driverDetails.firstName} onChange={e => setDriverDetails({...driverDetails, firstName: e.target.value})} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Soyad</label>
                  <input type="text" className="form-control" value={driverDetails.lastName} onChange={e => setDriverDetails({...driverDetails, lastName: e.target.value})} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">T.C. Kimlik No</label>
                  <input type="text" className="form-control" maxLength={11} value={driverDetails.tcNo} onChange={e => setDriverDetails({...driverDetails, tcNo: e.target.value})} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Telefon</label>
                  <input type="tel" className="form-control" value={driverDetails.phone} onChange={e => setDriverDetails({...driverDetails, phone: e.target.value})} required />
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-soft)', color: 'var(--text-muted)' }}>
                Sistemde kayıtlı sürücü bilgileriniz kullanılacaktır.
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />

          {/* Ekstra Güvence ve Paketler */}
          <div>
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 500 }}><ShieldCheck size={20} opacity={0.5} /> Ek Güvence Paketleri</h3>
            <div className="flex flex-col gap-3">
              {extras.map(extra => {
                const isSelected = selectedExtraIds.includes(extra.id);
                return (
                  <label key={extra.id} className="flex items-center justify-between p-4 cursor-pointer transition-all" style={{ border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: 'var(--border-radius-soft)', background: isSelected ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleExtra(extra.id)}
                        style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontWeight: isSelected ? 500 : 400 }}>{extra.name}</span>
                    </div>
                    <span style={{ fontWeight: 500, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      ₺{extra.price} {extra.priceType === 1 ? '/ gün' : '/ toplam'}
                    </span>
                  </label>
                );
              })}
              {extras.length === 0 && <div className="text-muted text-sm">Yükleniyor veya bulunamadı...</div>}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />

          {/* Ödeme Yöntemi */}
          <div>
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 500 }}><CreditCard size={20} opacity={0.5} /> Ödeme Yöntemi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className="p-6 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all"
                style={{ 
                  border: `1px solid ${paymentMethod === 'PayAtOffice' ? 'var(--primary)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--border-radius-soft)',
                  background: paymentMethod === 'PayAtOffice' ? 'rgba(0,0,0,0.02)' : 'transparent'
                }}
              >
                <input type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === 'PayAtOffice'} onChange={() => setPaymentMethod('PayAtOffice')} />
                <CarFront size={28} color={paymentMethod === 'PayAtOffice' ? 'var(--primary)' : 'var(--accent)'} />
                <span style={{ fontWeight: 500, color: paymentMethod === 'PayAtOffice' ? 'var(--text-main)' : 'var(--text-muted)' }}>Ofiste Öde</span>
              </label>
              
              <label 
                className="p-6 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all"
                style={{ 
                  border: `1px solid ${paymentMethod === 'CreditCard' ? 'var(--primary)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--border-radius-soft)',
                  background: paymentMethod === 'CreditCard' ? 'rgba(0,0,0,0.02)' : 'transparent',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>%15 İNDİRİM</div>
                <input type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === 'CreditCard'} onChange={() => setPaymentMethod('CreditCard')} />
                <CreditCard size={28} color={paymentMethod === 'CreditCard' ? 'var(--primary)' : 'var(--accent)'} />
                <span style={{ fontWeight: 500, color: paymentMethod === 'CreditCard' ? 'var(--text-main)' : 'var(--text-muted)' }}>Hemen Öde</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Sağ Kolon - Sepet Özeti (Karanlık ve Premium) */}
      <div style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', padding: '8rem 10% 4rem 10%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: '7rem' }}>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.02em', color: '#FFF', marginBottom: '2rem' }}>Rezervasyon Özeti</h3>
          
          <div className="flex gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300'} alt={vehicle.model} style={{ width: '8rem', height: '5rem', objectFit: 'cover', borderRadius: '4px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 500, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>{vehicle.brand} {vehicle.model}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{days} Gün Kiralama</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Alış:</span>
              <span className="text-right">{pickupLocation?.name} <br/> {pickupDate.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Teslim:</span>
              <span className="text-right">{dropoffLocation?.name} <br/> {dropoffDate.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
            <div className="flex justify-between">
              <span>Araç Kira Bedeli</span>
              <span>₺{basePrice.toLocaleString('tr-TR')}</span>
            </div>
            
            {isOneWay && (
              <div className="flex justify-between">
                <span>Tek Yön Ücreti</span>
                <span>₺1.000</span>
              </div>
            )}

            {selectedExtraIds.length > 0 && (
              <div className="flex justify-between">
                <span>Ekstra Paketler</span>
                <span>₺{extrasTotal.toLocaleString('tr-TR')}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between mt-2" style={{ color: '#4ADE80' }}>
                <span>Online Ödeme İndirimi</span>
                <span>- ₺{discount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mb-8">
            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>Toplam Tutar</span>
            <span className="technical-data" style={{ fontSize: '3rem', fontWeight: 400, color: '#FFF', lineHeight: 1 }}>₺{finalPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', padding: '1.25rem', background: '#FFF', color: '#000', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s' }}>
            <CheckCircle size={20} /> Rezervasyonu Tamamla
          </button>
          
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.5 }}>
            Rezervasyon koşullarını ve kiralama sözleşmesini okudum, onaylıyorum.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Checkout;
