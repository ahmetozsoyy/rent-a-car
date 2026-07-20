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
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Car color={primaryColor} size={28} style={{ transition: 'color 0.3s ease' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: textColor, transition: 'color 0.3s ease' }}>
              Rent<span style={{ color: primaryColor, transition: 'color 0.3s ease' }}>A</span>Car
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{ color: textColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s ease' }}>{t('navbar.home')}</Link>
            <Link to="/fleet" style={{ color: mutedColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s ease' }}>{t('navbar.fleet')}</Link>
            <Link to="/about" style={{ color: mutedColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s ease' }}>{t('navbar.about')}</Link>
          </div>
        </div>

        {/* Auth Buttons and Lang Switcher */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '1rem', cursor: 'pointer', minWidth: '40px', justifyContent: 'center' }} onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
            <Globe size={18} color={mutedColor} style={{ transition: 'color 0.3s ease' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', transition: 'color 0.3s ease' }}>
              {i18n.language === 'tr' ? 'TR' : 'EN'}
            </span>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: isTransparent ? '#FFFFFF' : 'var(--primary)', color: isTransparent ? '#111111' : '#FFFFFF' }}>
                <LayoutDashboard size={18} /> {t('navbar.dashboard')}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.625rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center', borderColor: isTransparent ? 'rgba(255,255,255,0.4)' : 'var(--glass-border)', color: isTransparent ? '#FFFFFF' : 'var(--primary)' }}>
                <LogOut size={18} /> {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.625rem 1.25rem', borderColor: isTransparent ? 'rgba(255,255,255,0.4)' : 'var(--glass-border)', color: isTransparent ? '#FFFFFF' : 'var(--primary)' }}>{t('navbar.login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem', backgroundColor: isTransparent ? '#FFFFFF' : 'var(--primary)', color: isTransparent ? '#111111' : '#FFFFFF' }}>{t('navbar.signup')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
