import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

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
      setSuccess(t('toast.registerSuccess'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(t('toast.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 5rem)', position: 'relative' }}>
      
      {/* Toast Notification for Success/Error */}
      {(error || success) && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: success ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 250ms var(--ease-spring) forwards',
          zIndex: 100
        }}>
          {error || success}
        </div>
      )}

      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <h2 className="text-center" style={{ fontSize: '2rem' }}>{t('register.title')}</h2>
        <p className="text-center mb-6">{t('register.subtitle')}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('register.firstName')}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="John" 
              required
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.lastName')}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Doe" 
              required
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.email')}</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="john@example.com" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">{t('register.password')}</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
