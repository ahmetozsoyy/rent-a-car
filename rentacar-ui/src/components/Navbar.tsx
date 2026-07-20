import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTransparent = isHome && !isScrolled;
  
  // Text color transitions based on background
  const textColor = isTransparent ? '#FFFFFF' : 'var(--text-main)';
  const mutedColor = isTransparent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)';
  const primaryColor = isTransparent ? '#FFFFFF' : 'var(--primary)';

  return (
    <nav className={`glass-nav ${isScrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem', transition: 'all 0.3s ease' }}>
        
        {/* Left Side: Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: textColor, letterSpacing: '-0.02em', transition: 'color 0.3s ease' }}>
              Rent<span style={{ color: isTransparent ? 'rgba(255,255,255,0.7)' : 'var(--accent)', transition: 'color 0.3s ease' }}>A</span>Car
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link to="/" style={{ color: textColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>{t('navbar.home')}</Link>
            <Link to="/fleet" style={{ color: mutedColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>{t('navbar.fleet')}</Link>
            <Link to="/about" style={{ color: mutedColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>{t('navbar.about')}</Link>
          </div>
        </div>

        {/* Auth Buttons and Lang Switcher */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem', cursor: 'pointer', minWidth: '40px', justifyContent: 'center' }} onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.3s ease' }}>
              {i18n.language === 'tr' ? 'TR' : 'EN'}
            </span>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', backgroundColor: isTransparent ? '#FFFFFF' : 'var(--primary)', color: isTransparent ? '#111111' : '#FFFFFF' }}>
                {t('navbar.dashboard')}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderColor: isTransparent ? 'rgba(255,255,255,0.2)' : 'var(--glass-border)', color: isTransparent ? '#FFFFFF' : 'var(--primary)' }}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderColor: isTransparent ? 'rgba(255,255,255,0.2)' : 'var(--glass-border)', color: isTransparent ? '#FFFFFF' : 'var(--primary)' }}>{t('navbar.login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', backgroundColor: isTransparent ? '#FFFFFF' : 'var(--primary)', color: isTransparent ? '#111111' : '#FFFFFF' }}>{t('navbar.signup')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
