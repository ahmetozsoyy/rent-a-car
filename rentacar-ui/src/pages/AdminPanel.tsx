import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Shield, ShieldPlus, CarFront, Calendar, MapPin, Mail, AlertTriangle, CheckCircle2, Send, MessageSquare, List, Wrench, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { customConfirm } from '../utils/customConfirm';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const { notifications, markAsReadByLocation } = useNotificationStore();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Moderator form
  const [modEmail, setModEmail] = useState('');
  const [modLocation, setModLocation] = useState('');
  const [modMessage, setModMessage] = useState({ text: '', type: '' });

  // Blocked Vehicles List
  const [blockedVehicles, setBlockedVehicles] = useState<any[]>([]);

  // Messaging
  const [locationsWithMessages, setLocationsWithMessages] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'moderators' | 'vehicles' | 'messages'>('messages');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'messages') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, activeTab]);

  // Block Vehicle form
  const [blockLocationId, setBlockLocationId] = useState('');
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
        const locMsgRes = await api.get('/admin/locations-with-messages');
        setLocationsWithMessages(locMsgRes.data);
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
    const confirmed = await customConfirm('Bu bloku kaldırmak istediğinize emin misiniz?');
    if (!confirmed) return;
    try {
      await api.delete(`/admin/unblock-vehicle/${id}`);
      setBlockedVehicles(prev => prev.filter(b => b.id !== id));
      setBlockMessage({ text: 'Araç blokesi başarıyla kaldırıldı.', type: 'success' });
    } catch (err: any) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.title || 'Hata oluştu.';
      setBlockMessage({ text: errMsg, type: 'error' });
    }
  };

  const fetchMessages = async (locationId: string) => {
    setSelectedLocationId(locationId);
    try {
      const mRes = await api.get(`/admin/messages/${locationId}`);
      setMessages(mRes.data);
    } catch (err) {
      console.error('Error fetching messages', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId || !newMessage.trim()) return;
    try {
      await api.post('/admin/messages', {
        locationId: selectedLocationId,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedLocationId);
    } catch (err: any) {
      toast.error(err.response?.data || 'Mesaj gönderilemedi.');
    }
  };

  if (role !== 'Admin') return null;

  return (
    <div style={{ padding: '6rem 2rem 2rem 2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={32} color="var(--primary)" /> Yönetim Paneli
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('moderators')} 
            className={`tab-btn ${activeTab === 'moderators' ? 'active' : ''}`}
          >
            <Users size={18} /> Moderatör Ata
          </button>
          <button 
            onClick={() => setActiveTab('vehicles')} 
            className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
          >
            <Wrench size={18} /> Araç Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          >
            <MessageSquare size={18} /> Şube İletişim
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {activeTab === 'moderators' && (
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
          )}

          {activeTab === 'vehicles' && (
            <>
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
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><MapPin size={16} /> Şube Seçimi</label>
                <select className="form-control" required value={blockLocationId} onChange={e => { setBlockLocationId(e.target.value); setBlockVehicleId(''); }}>
                  <option value="">Ofis Seçin</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CarFront size={16} /> Araç Seçimi</label>
                <select className="form-control" required disabled={!blockLocationId} value={blockVehicleId} onChange={e => setBlockVehicleId(e.target.value)}>
                  <option value="">Araç Seçin</option>
                  {vehicles.filter(v => blockLocationId ? v.locationName.includes(locations.find(l => l.id === blockLocationId)?.city || '') : true).map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} {v.licensePlate ? `- ${v.licensePlate}` : ''}</option>
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
          </>
          )}

          {activeTab === 'messages' && (
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <MessageSquare size={22} className="text-primary" /> Şube İletişim & Destek
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem', height: '400px' }}>
              {/* Şube Listesi */}
              <div style={{ borderRight: '1px solid var(--glass-border)', overflowY: 'auto', paddingRight: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--muted-color)', marginBottom: '1rem' }}>Şubeler</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {locationsWithMessages.map(loc => {
                    const hasUnread = notifications.some(n => !n.read && n.locationId === loc.id);
                    return (
                      <button 
                        key={loc.id} 
                        onClick={() => {
                          fetchMessages(loc.id);
                          markAsReadByLocation(loc.id);
                        }}
                        style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          border: 'none', 
                          textAlign: 'left',
                          cursor: 'pointer',
                          background: selectedLocationId === loc.id ? 'var(--primary)' : 'var(--glass-bg)',
                          color: selectedLocationId === loc.id ? 'white' : 'inherit',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{loc.name}</span>
                        {hasUnread && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'red' }}></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mesaj Listesi ve Gönderme Formu */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', overflow: 'hidden' }}>
                {!selectedLocationId ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-color)' }}>
                    Lütfen sol taraftan bir şube seçin.
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {messages.length === 0 ? (
                        <p style={{ color: 'var(--muted-color)', textAlign: 'center', margin: 'auto' }}>Henüz bir mesaj bulunmuyor.</p>
                      ) : (
                        messages.map(m => (
                          <div key={m.id} style={{ alignSelf: m.isFromAdmin ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted-color)', marginBottom: '0.2rem', textAlign: m.isFromAdmin ? 'right' : 'left' }}>
                              {m.senderName} • {new Date(m.createdAt).toLocaleString()}
                            </div>
                            <div style={{ 
                              padding: '0.75rem 1rem', 
                              borderRadius: '12px', 
                              background: m.isFromAdmin ? 'var(--primary)' : 'var(--glass-bg)',
                              color: m.isFromAdmin ? 'white' : 'inherit',
                              border: m.isFromAdmin ? 'none' : '1px solid var(--glass-border)',
                              borderBottomLeftRadius: m.isFromAdmin ? '12px' : '0',
                              borderBottomRightRadius: m.isFromAdmin ? '0' : '12px',
                            }}>
                              {m.content}
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <textarea 
                        className="input-field" 
                        placeholder="Mesajınızı yazın..." 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)}
                        style={{ flex: 1, minHeight: '80px', padding: '1rem', resize: 'vertical', borderRadius: '12px' }}
                        required
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', height: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                        <Send size={18} /> Yanıtla
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
