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
  priceType: number; // 1 = PerDay, 2 = Fixed
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
        
        // Simüle edilmiş extras fetch işlemi (backend henüz endpoint vermediyse)
        // Eğer backend endpoint'i varsa:
        try {
           const extrasData = await api.get('/rentalextras');
           setExtras(extrasData.data);
           
           // Query'den gelen sigortayı otomatik seç
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

  if (loading || !vehicle) return <div className="text-center mt-8">Yükleniyor...</div>;

  const pickupDate = new Date(pickupDateStr!);
  const dropoffDate = new Date(dropoffDateStr!);
  let days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 3600 * 24));
  if (days <= 0) days = 1;

  const pickupLocation = locations.find(l => l.id === pickupLocId);
  const dropoffLocation = locations.find(l => l.id === dropoffLocId);
  const isOneWay = pickupLocId !== dropoffLocId;

  // Fiyat Hesaplama
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
        userId: '11111111-1111-1111-1111-111111111111', // Dummy for now
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
      
      const response = await api.post('/reservations', payload);
      alert('Rezervasyon başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Rezervasyon oluşturulurken hata oluştu.');
    }
  };

  return (
    <div className="container mt-8 pb-8">
      <h1 className="mb-4">{t('checkout.title') || 'Rezervasyon ve Ödeme'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sol Kolon - Formlar */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Sürücü Bilgileri */}
          <div className="glass p-6">
            <h3 className="mb-4 flex items-center gap-2"><Users size={20}/> Sürücü Bilgileri</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isForSomeoneElse} 
                  onChange={e => setIsForSomeoneElse(e.target.checked)} 
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
              <div className="text-muted text-sm">
                Giriş yapmış olduğunuz hesabın bilgileri sürücü bilgisi olarak kullanılacaktır.
              </div>
            )}
          </div>

          {/* Ekstra Güvence ve Paketler */}
          <div className="glass p-6">
            <h3 className="mb-4 flex items-center gap-2"><ShieldCheck size={20}/> Ek Güvence & Paketler</h3>
            <div className="flex flex-col gap-3">
              {extras.map(extra => (
                <label key={extra.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--glass-border)' }}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedExtraIds.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    <span>{extra.name}</span>
                  </div>
                  <span className="font-semibold">
                    ₺{extra.price} {extra.priceType === 1 ? '/ gün' : '/ toplam'}
                  </span>
                </label>
              ))}
              {extras.length === 0 && <div className="text-muted text-sm">Yükleniyor veya bulunamadı...</div>}
            </div>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="glass p-6">
            <h3 className="mb-4 flex items-center gap-2"><CreditCard size={20}/> Ödeme Yöntemi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'PayAtOffice' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                style={{ borderColor: paymentMethod === 'PayAtOffice' ? 'var(--primary)' : 'var(--glass-border)' }}
              >
                <input type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === 'PayAtOffice'} onChange={() => setPaymentMethod('PayAtOffice')} />
                <CarFront size={32} color={paymentMethod === 'PayAtOffice' ? 'var(--primary)' : 'gray'} />
                <span className="font-semibold">Ofiste Öde</span>
              </label>
              
              <label 
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'CreditCard' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                style={{ borderColor: paymentMethod === 'CreditCard' ? 'var(--primary)' : 'var(--glass-border)', position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>%15 İndirim</div>
                <input type="radio" name="paymentMethod" className="hidden" checked={paymentMethod === 'CreditCard'} onChange={() => setPaymentMethod('CreditCard')} />
                <CreditCard size={32} color={paymentMethod === 'CreditCard' ? 'var(--primary)' : 'gray'} />
                <span className="font-semibold">Kredi Kartı ile Hemen Öde</span>
              </label>
            </div>
          </div>

        </div>

        {/* Sağ Kolon - Sepet Özeti */}
        <div>
          <div className="glass p-6" style={{ position: 'sticky', top: '2rem' }}>
            <h3 className="mb-4">Sepet Özeti</h3>
            
            <div className="flex gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300'} alt={vehicle.model} className="w-24 h-16 object-cover rounded" />
              <div>
                <div className="font-bold">{vehicle.brand} {vehicle.model}</div>
                <div className="text-sm text-muted">{days} Gün Kiralama</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm mb-4 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex justify-between">
                <span className="text-muted">Alış:</span>
                <span className="text-right">{pickupLocation?.name} <br/> {pickupDate.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted">Teslim:</span>
                <span className="text-right">{dropoffLocation?.name} <br/> {dropoffDate.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm mb-4 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex justify-between">
                <span>Araç Kira Bedeli ({days} gün)</span>
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
                <div className="flex justify-between text-green-600 font-semibold mt-2">
                  <span>Online Ödeme İndirimi (%15)</span>
                  <span>- ₺{discount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Toplam Tutar</span>
              <span className="text-2xl font-bold text-primary">₺{finalPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
            </div>

            <button onClick={handleSubmit} className="btn btn-primary w-full flex justify-center items-center gap-2 py-3">
              <CheckCircle size={20} /> Rezervasyonu Tamamla
            </button>
            <p className="text-xs text-center text-muted mt-3">
              Rezervasyon koşullarını ve kiralama sözleşmesini okudum, onaylıyorum.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
