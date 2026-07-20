import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Building2, Check, X, CarFront, Calendar, AlertTriangle, CheckCircle2, Trash2, Send, MessageSquare, List, Wrench } from 'lucide-react';
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

  // Messages
  const [messages, setMessages] = useState<any[]>([]);
  const [newSenderName, setNewSenderName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Tabs
  const [activeTab, setActiveTab] = useState<'reservations' | 'vehicles' | 'messages'>('reservations');

  useEffect(() => {
    if (role !== 'Moderator') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const rRes = await api.get('/moderator/reservations');
        setReservations(rRes.data);
        
        const vRes = await api.get('/moderator/vehicles');
        setVehicles(vRes.data);
        
        const bRes = await api.get('/moderator/blocked-vehicles');
        setBlockedVehicles(bRes.data);
        
        const mRes = await api.get('/moderator/messages');
        setMessages(mRes.data);
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
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setBlockMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleUnblockVehicle = async (id: string) => {
    if (!window.confirm('Bu bloku kaldırmak istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/moderator/unblock-vehicle/${id}`);
      setBlockedVehicles(prev => prev.filter(b => b.id !== id));
      setBlockMessage({ text: 'Araç blokesi başarıyla kaldırıldı.', type: 'success' });
    } catch (err: any) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setBlockMessage({ text: errMsg, type: 'error' });
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Rezervasyonu tamamen silmek (veritabanından kaldırmak) istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
    try {
      await api.delete(`/moderator/delete-reservation/${id}`);
      const rRes = await api.get('/moderator/reservations');
      setReservations(rRes.data);
    } catch (err: any) {
      alert(err.response?.data || 'Hata oluştu.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSenderName.trim() || !newMessage.trim()) {
      alert('Lütfen adınızı ve mesajınızı girin.');
      return;
    }
    try {
      await api.post('/moderator/messages', {
        senderName: newSenderName,
        content: newMessage
      });
      setNewMessage('');
      // Refresh messages
      const mRes = await api.get('/moderator/messages');
      setMessages(mRes.data);
    } catch (err: any) {
      alert(err.response?.data || 'Mesaj gönderilemedi.');
    }
  };

  if (role !== 'Moderator') return null;

  return (
    <div style={{ padding: '6rem 2rem 2rem 2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={32} color="var(--primary)" /> Şube Yönetimi
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('reservations')} 
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: activeTab === 'reservations' ? 'var(--primary-color)' : 'var(--glass-bg)', color: activeTab === 'reservations' ? 'white' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.2s' }}
          >
            <List size={18} /> Rezervasyonlar
          </button>
          <button 
            onClick={() => setActiveTab('vehicles')} 
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: activeTab === 'vehicles' ? 'var(--primary-color)' : 'var(--glass-bg)', color: activeTab === 'vehicles' ? 'white' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.2s' }}
          >
            <Wrench size={18} /> Araç Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: activeTab === 'messages' ? 'var(--primary-color)' : 'var(--glass-bg)', color: activeTab === 'messages' ? 'white' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.2s' }}
          >
            <MessageSquare size={18} /> Admin İletişim
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {activeTab === 'vehicles' && (
            <>
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
                <select className="form-control" required value={blockVehicleId} onChange={e => setBlockVehicleId(e.target.value)}>
                  <option value="">Araç Seçin</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.locationName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Başlangıç</label>
                <input type="date" className="form-control" required value={blockStart} onChange={e => setBlockStart(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={16} /> Bitiş</label>
                <input type="date" className="form-control" required value={blockEnd} onChange={e => setBlockEnd(e.target.value)} />
              </div>

              <div className="form-group" style={{ flex: '2 1 200px' }}>
                <label>Sebep / Açıklama</label>
                <input type="text" className="form-control" required value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Örn: Periyodik Bakım, Kaza vb." />
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
          </>
          )}

          {activeTab === 'reservations' && (
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Şubeye Düşen Rezervasyonlar
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
                          <button onClick={() => handleReject(res.id)} className="btn" style={{ padding: '0.4rem', borderRadius: '8px', background: '#F59E0B15', color: '#F59E0B', border: 'none', cursor: 'pointer' }} title="Reddet">
                            <X size={18} />
                          </button>
                          <button onClick={() => handleDelete(res.id)} className="btn" style={{ padding: '0.4rem', borderRadius: '8px', background: '#EF444415', color: '#EF4444', border: 'none', cursor: 'pointer' }} title="Tamamen Sil">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

          {activeTab === 'messages' && (
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <MessageSquare size={22} className="text-primary" /> Admin İletişim & Destek
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Mesaj Listesi */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--muted-color)', textAlign: 'center', margin: 'auto' }}>Henüz bir mesaj bulunmuyor.</p>
                ) : (
                  messages.map(m => (
                    <div key={m.id} style={{ alignSelf: m.isFromAdmin ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-color)', marginBottom: '0.2rem', textAlign: m.isFromAdmin ? 'left' : 'right' }}>
                        {m.senderName} • {new Date(m.createdAt).toLocaleString()}
                      </div>
                      <div style={{ 
                        padding: '0.75rem 1rem', 
                        borderRadius: '12px', 
                        background: m.isFromAdmin ? 'var(--glass-bg)' : 'var(--primary-color)',
                        color: m.isFromAdmin ? 'inherit' : 'white',
                        border: m.isFromAdmin ? '1px solid var(--glass-border)' : 'none',
                        borderBottomLeftRadius: m.isFromAdmin ? '0' : '12px',
                        borderBottomRightRadius: m.isFromAdmin ? '12px' : '0',
                      }}>
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Mesaj Gönderme Formu */}
              <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Adınız (Örn: Ahmet - Satış)" 
                  value={newSenderName} 
                  onChange={e => setNewSenderName(e.target.value)}
                  style={{ width: '100%', maxWidth: '300px', padding: '0.75rem' }}
                  required
                />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <textarea 
                    className="input-field" 
                    placeholder="Mesajınızı yazın..." 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    style={{ flex: 1, minHeight: '80px', padding: '1rem', resize: 'vertical', borderRadius: '12px' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', height: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <Send size={18} /> Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;
