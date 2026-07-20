import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Shield, ShieldPlus, CarFront, Calendar, MapPin, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Moderator form
  const [modEmail, setModEmail] = useState('');
  const [modLocation, setModLocation] = useState('');
  const [modMessage, setModMessage] = useState({ text: '', type: '' });

  // Blocked Vehicles List
  const [blockedVehicles, setBlockedVehicles] = useState<any[]>([]);

  // Block Vehicle form
  const [blockVehicleId, setBlockVehicleId] = useState('');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockMessage, setBlockMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (role !== 'Admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const vRes = await api.get('/vehicles');
        setVehicles(vRes.data);
        const lRes = await api.get('/locations');
        setLocations(lRes.data);
        const bRes = await api.get('/admin/blocked-vehicles');
        setBlockedVehicles(bRes.data);
      } catch (err) {
        console.error('Error fetching data for admin panel', err);
      }
    };
    fetchData();
  }, [role, navigate]);

  const handleAssignModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-moderator', { email: modEmail, locationId: modLocation });
      setModMessage({ text: 'Yetki başarıyla atandı.', type: 'success' });
      setModEmail('');
    } catch (err: any) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setModMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleBlockVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/block-vehicle', {
        vehicleId: blockVehicleId,
        startDate: blockStart,
        endDate: blockEnd,
        reason: blockReason
      });
      setBlockMessage({ text: 'Araç başarıyla yayından kaldırıldı.', type: 'success' });
      setBlockStart('');
      setBlockEnd('');
      setBlockReason('');
      
      // Listeyi yenile
      const bRes = await api.get('/admin/blocked-vehicles');
      setBlockedVehicles(bRes.data);
    } catch (err: any) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setBlockMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleUnblockVehicle = async (id: string) => {
    if (!window.confirm('Bu bloku kaldırmak istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/unblock-vehicle/${id}`);
      setBlockedVehicles(prev => prev.filter(b => b.id !== id));
      setBlockMessage({ text: 'Araç blokesi başarıyla kaldırıldı.', type: 'success' });
    } catch (err: any) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setBlockMessage({ text: errMsg, type: 'error' });
    }
  };

  if (role !== 'Admin') return null;

  return (
    <div style={{ padding: '6rem 2rem 2rem 2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={32} color="var(--primary)" /> Yönetim Paneli
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* Moderatör Ata */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldPlus size={20} /> Şube Yetkilisi (Moderatör) Ata
            </h2>

            {modMessage.text && (
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: modMessage.type === 'success' ? '#10B98115' : '#EF444415', color: modMessage.type === 'success' ? '#10B981' : '#EF4444' }}>
                {modMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />} {modMessage.text}
              </div>
            )}

            <form onSubmit={handleAssignModerator} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Mail size={16} /> Kullanıcı E-posta</label>
                <input type="email" className="form-control" required value={modEmail} onChange={e => setModEmail(e.target.value)} placeholder="ornek@mail.com" />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><MapPin size={16} /> Sorumlu Şube</label>
                <select className="form-control" required value={modLocation} onChange={e => setModLocation(e.target.value)}>
                  <option value="">Şube Seçin</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Yetki Ver</button>
            </form>
          </div>

          {/* Aracı Yayından Kaldır */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Aracı Yayından Kaldır (Bakım/Bloke)
            </h2>

            {blockMessage.text && (
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: blockMessage.type === 'success' ? '#10B98115' : '#EF444415', color: blockMessage.type === 'success' ? '#10B981' : '#EF4444' }}>
                {blockMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />} {blockMessage.text}
              </div>
            )}

            <form onSubmit={handleBlockVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CarFront size={16} /> Araç Seçimi</label>
                <select className="form-control" required value={blockVehicleId} onChange={e => setBlockVehicleId(e.target.value)}>
                  <option value="">Araç Seçin</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.plate || v.year}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Başlangıç</label>
                  <input type="date" className="form-control" required value={blockStart} onChange={e => setBlockStart(e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Bitiş</label>
                  <input type="date" className="form-control" required value={blockEnd} onChange={e => setBlockEnd(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Sebep / Açıklama</label>
                <input type="text" className="form-control" required value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Örn: Periyodik Bakım, Kaza vb." />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', background: '#EF4444', borderColor: '#EF4444' }}>Aracı Yayından Kaldır</button>
            </form>
          </div>

          {/* Bloklu Araçlar Listesi */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
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

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
