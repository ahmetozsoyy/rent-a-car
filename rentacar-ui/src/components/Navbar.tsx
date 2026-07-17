import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Car color="var(--primary)" size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Rent<span style={{ color: 'var(--primary)' }}>A</span>Car
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <Link to="/fleet" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Fleet</Link>
          <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>About</Link>
        </div>

        {/* Auth Buttons and Lang Switcher */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '1rem', cursor: 'pointer' }} onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
            <Globe size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {i18n.language === 'tr' ? 'TR' : 'EN'}
            </span>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
