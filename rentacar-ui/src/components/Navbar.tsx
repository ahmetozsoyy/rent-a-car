import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useTranslation } from 'react-i18next';
import { User, Bell } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuthStore();
  const { unreadCount, notifications, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
      <div style={{ width: '100%', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem', transition: 'all 0.3s ease' }}>
        
        {/* Left Side: Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mixBlendMode: 'multiply' }}>
            <img 
              src="/images/vehicles/logo.png" 
              alt="RentACar Logo" 
              style={{ height: '65px', objectFit: 'contain' }} 
            />
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
          {isAuthenticated ? (
            <>
              {role === 'Admin' && (
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.9rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                  Yönetici Paneli
                </Link>
              )}
              {role === 'Moderator' && (
                <Link to="/moderator" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.9rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                  Şube Yönetimi
                </Link>
              )}
              
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.9rem', background: 'var(--text-main)', color: '#FFF', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                <User size={16} /> Detaylarım
              </Link>
              
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    if (!showNotifDropdown && unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                  style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', marginLeft: '0.5rem' }}
                  title="Bildirim Geçmişi"
                >
                  <Bell size={20} color="var(--text-main)" />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: -2, right: -2, background: 'red', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>

                {showNotifDropdown && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '120%', 
                    right: 0, 
                    width: '320px', 
                    background: '#FFFFFF', 
                    backdropFilter: 'blur(16px)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
                    overflow: 'hidden',
                    zIndex: 1000 
                  }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Bildirim Geçmişi
                      {notifications.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setShowNotifDropdown(false)}>Kapat</span>
                      )}
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Henüz bir bildirim yok
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.02)', background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{n.message}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
