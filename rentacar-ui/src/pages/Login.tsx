import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginFn = useAuthStore(state => state.login);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      
      loginFn(token);
      navigate('/');
    } catch (err: any) {
      setError(t('toast.loginError') || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout page-enter">
      
      {/* Toast Notification for Error */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.95)',
          color: 'white',
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 250ms var(--ease-spring) forwards',
          zIndex: 100
        }}>
          {error}
        </div>
      )}

      {/* Left Image Area */}
      <div style={{
        backgroundImage: 'url(/images/vehicles/giris.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}>
        {/* No Overlay */}
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
        
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>Tekrar<br/>Hoş Geldiniz</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem' }}>{t('login.subtitle') || 'Harika deneyime kaldığınız yerden devam edin.'}</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group mb-0">
              <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('login.email') || 'E-Posta'}</label>
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
              <label className="form-label" style={{ opacity: 0.7, fontSize: '0.875rem' }}>{t('login.password') || 'Şifre'}</label>
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
              <span>{loading ? t('login.loading') : (t('login.submit') || 'Giriş Yap')}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hesabınız yok mu? <Link to="/register" style={{ color: 'var(--text-main)', fontWeight: 500, textDecoration: 'none' }}>Yeni Hesap Oluştur</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
