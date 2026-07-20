import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/auth/register', formData);
      setSuccess(t('toast.registerSuccess') || 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(t('toast.registerError') || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout page-enter">
      
      {/* Toast Notification for Success/Error */}
      {(error || success) && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: success ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white',
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 250ms var(--ease-spring) forwards',
          zIndex: 100
        }}>
          {error || success}
        </div>
      )}

      {/* Left Image Area */}
      <div style={{
        backgroundImage: 'url(/images/vehicles/toyota-corolla.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}>
        {/* Subtle Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' }} />
      </div>

      {/* Right Content Area */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '8rem 15% 4rem 15%',
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh',
        zIndex: 1
      }}>
        
        <div style={{ maxWidth: '450px', width: '100%' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{t('register.title') || 'Hesap Oluştur'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem' }}>{t('register.subtitle') || 'Ayrıcalıklı dünyaya adım atın.'}</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('register.firstName') || 'Ad'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John" 
                  style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('register.lastName') || 'Soyad'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Doe" 
                  style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('register.email') || 'E-Posta'}</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="ornek@mail.com"
                style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('register.password') || 'Şifre'}</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', background: 'transparent' }}
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} disabled={loading}>
              <span>{loading ? t('register.loading') : (t('register.submit') || 'Kayıt Ol')}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--text-main)', fontWeight: 500, textDecoration: 'none' }}>Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
