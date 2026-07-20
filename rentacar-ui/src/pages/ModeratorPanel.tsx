import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Building2, Check, X, CarFront, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ModeratorPanel: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [blockedVehicles, setBlockedVehicles] = useState<any[]>([]);
  
  // Block Vehicle form
  const [blockVehicleId, setBlockVehicleId] = useState('');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockMessage, setBlockMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (role !== 'Moderator') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const rRes = await api.get('/moderator/reservations');
        setReservations(rRes.data);
        
        const vRes = await api.get('/vehicles');
        setVehicles(vRes.data);
        
        const bRes = await api.get('/moderator/blocked-vehicles');
        setBlockedVehicles(bRes.data);
      } catch (err) {
        console.error('Error fetching data for moderator panel', err);
      }
    };
    fetchData();
  }, [role, navigate]);

  const handleBlockVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/moderator/block-vehicle', {
        vehicleId: blockVehicleId,
        startDate: blockStart,
        endDate: blockEnd,
        reason: blockReason
      });
      setBlockMessage({ text: 'Araç başarıyla yayından kaldırıldı.', type: 'success' });
      setBlockStart('');
      setBlockEnd('');
      setBlockReason('');
      
      const bRes = await api.get('/moderator/blocked-vehicles');
      setBlockedVehicles(bRes.data);
    } catch (err: any) {
      setBlockMessage({ text: err.response?.data || 'Hata oluştu.', type: 'error' });
    }
  };

  const handleUnblockVehicle = async (id: string) => {
    if (!window.confirm('Bu bloku kaldırmak istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/moderator/unblock-vehicle/${id}`);
      setBlockedVehicles(prev => prev.filter(b => b.id !== id));
      setBlockMessage({ text: 'Araç blokesi başarıyla kaldırıldı.', type: 'success' });
    } catch (err: any) {
      setBlockMessage({ text: err.response?.data || 'Hata oluştu.', type: 'error' });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/moderator/approve-reservation/${id}`);
      const rRes = await api.get('/moderator/reservations');
      setReservations(rRes.data);
    } catch (err: any) {
      alert(err.response?.data || 'Hata oluştu.');
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Rezervasyonu reddetmek istediğinize emin misiniz?')) return;
    try {
      await api.post(`/moderator/reject-reservation/${id}`);
      const rRes = await api.get('/moderator/reservations');
      setReservations(rRes.data);
    } catch (err: any) {
      alert(err.response?.data || 'Hata oluştu.');
    }
  };

  if (role !== 'Moderator') return null;

  return (
    <div style={{ padding: '6rem 2rem 2rem 2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={32} color="var(--primary)" /> Şube Yönetimi
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Araç Bloklama Bölümü */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Aracı Yayından Kaldır (Şube)
            </h2>

            {blockMessage.text && (
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: blockMessage.type === 'success' ? '#10B98115' : '#EF444415', color: blockMessage.type === 'success' ? '#10B981' : '#EF4444' }}>
                {blockMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />} {blockMessage.text}
              </div>
            )}

            <form onSubmit={handleBlockVehicle} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CarFront size={16} /> Araç Seçimi</label>
                <select className="form-input" required value={blockVehicleId} onChange={e => setBlockVehicleId(e.target.value)}>
                  <option value="">Araç Seçin</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Başlangıç</label>
                <input type="date" className="form-input" required value={blockStart} onChange={e => setBlockStart(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Bitiş</label>
                <input type="date" className="form-input" required value={blockEnd} onChange={e => setBlockEnd(e.target.value)} />
              </div>

              <div className="form-group" style={{ flex: '2 1 200px' }}>
                <label>Sebep / Açıklama</label>
                <input type="text" className="form-input" required value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Örn: Bakım" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444', height: '42px', padding: '0 1.5rem' }}>Yayından Kaldır</button>
            </form>
          </div>

          {/* Bloklu Araçlar Listesi */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Bakımdaki / Bloklu Araçlar
            </h2>
            {blockedVehicles.length === 0 ? (
              <p style={{ color: 'var(--muted-color)' }}>Yayından kaldırılmış araç bulunmuyor.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--muted-color)' }}>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Araç</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Başlangıç</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Bitiş</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Sebep</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedVehicles.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{b.vehicle}</td>
                        <td style={{ padding: '1rem' }}>{b.startDate}</td>
                        <td style={{ padding: '1rem' }}>{b.endDate}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, background: '#F59E0B15', color: '#F59E0B' }}>
                            {b.reason}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => handleUnblockVehicle(b.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: '#EF4444', color: '#EF4444' }}>Bloku Kaldır</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Şubeye Gelen Rezervasyonlar */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Şubeye Düşen Rezervasyonlar
            </h2>

            {reservations.length === 0 ? (
              <p style={{ color: 'var(--muted-color)' }}>Şu an şubenize ait bekleyen veya aktif bir rezervasyon bulunmuyor.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--muted-color)' }}>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>PNR Kodu</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Araç</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Alış Tarihi</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Teslim Tarihi</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>Durum</th>
                      <th style={{ padding: '1rem', fontWeight: 500 }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr key={res.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{res.pnrCode}</td>
                        <td style={{ padding: '1rem' }}>{res.vehicle}</td>
                        <td style={{ padding: '1rem' }}>{res.pickupDate}</td>
                        <td style={{ padding: '1rem' }}>{res.dropoffDate}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, background: res.status === 'Active' || res.status === 'Confirmed' ? '#10B98115' : res.status === 'Cancelled' ? '#EF444415' : '#F59E0B15', color: res.status === 'Active' || res.status === 'Confirmed' ? '#10B981' : res.status === 'Cancelled' ? '#EF4444' : '#F59E0B' }}>
                            {res.status === 'Pending' ? 'Onay Bekliyor' : res.status === 'Active' ? 'Aktif' : res.status === 'Confirmed' ? 'Onaylandı' : res.status === 'Cancelled' ? 'İptal Edildi' : res.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleApprove(res.id)} className="btn" style={{ padding: '0.4rem', borderRadius: '8px', background: '#10B98115', color: '#10B981', border: 'none', cursor: 'pointer' }} title="Onayla">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleReject(res.id)} className="btn" style={{ padding: '0.4rem', borderRadius: '8px', background: '#EF444415', color: '#EF4444', border: 'none', cursor: 'pointer' }} title="Reddet">
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;
