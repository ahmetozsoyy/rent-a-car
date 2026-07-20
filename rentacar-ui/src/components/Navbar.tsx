import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Split-layout (Solu beyaz, sağı resim) olduğu için artık Hero'da tam sayfa beyaz text kullanamayız.
  // Bu yüzden her zaman ana metin rengini (siyah) ve okunaklılığı artırmak için glass efekti kullanıyoruz.
  const textColor = 'var(--text-main)';
  const mutedColor = 'var(--text-muted)';

  return (
    <nav className={`glass-nav ${isScrolled ? 'scrolled' : ''}`} style={{ 
      background: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)', 
      backdropFilter: 'blur(12px)', 
      borderBottom: '1px solid rgba(0,0,0,0.05)' 
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem', transition: 'all 0.3s ease' }}>
        
        {/* Left Side: Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: textColor, letterSpacing: '-0.02em', transition: 'color 0.3s ease' }}>
              Rent<span style={{ color: 'var(--accent)' }}>A</span>Car
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link to="/" style={{ color: location.pathname === '/' ? textColor : mutedColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/' ? 700 : 400, letterSpacing: '-0.01em', transition: 'all 0.3s ease' }}>{t('navbar.home')}</Link>
            <Link to="/fleet" style={{ color: location.pathname === '/fleet' ? textColor : mutedColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/fleet' ? 700 : 400, letterSpacing: '-0.01em', transition: 'all 0.3s ease' }}>{t('navbar.fleet')}</Link>
            <Link to="/about" style={{ color: location.pathname === '/about' ? textColor : mutedColor, textDecoration: 'none', fontSize: '0.95rem', fontWeight: location.pathname === '/about' ? 700 : 400, letterSpacing: '-0.01em', transition: 'all 0.3s ease' }}>{t('navbar.about')}</Link>
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
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                {t('navbar.dashboard')}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderColor: 'var(--glass-border)', color: 'var(--primary)' }}>{t('navbar.login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>{t('navbar.signup')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
