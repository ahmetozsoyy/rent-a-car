import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Navbar: React.FC = () => {
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

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
