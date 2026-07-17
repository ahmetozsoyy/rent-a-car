import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginFn = useAuthStore(state => state.login);
  
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
      
      // Store token in Zustand & LocalStorage
      loginFn(token);
      
      // Redirect to home
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 flex justify-center" style={{ position: 'relative' }}>
      
      {/* Toast Notification for Error */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '-4rem',
          right: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 250ms ease-in-out forwards',
          zIndex: 100
        }}>
          {error}
        </div>
      )}

      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center mb-4">Login to manage your rentals.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
