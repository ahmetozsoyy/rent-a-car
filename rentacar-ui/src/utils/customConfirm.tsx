import React from 'react';
import toast from 'react-hot-toast';

export const customConfirm = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.95rem' }}>{msg}</span>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => { toast.dismiss(t.id); resolve(true); }} 
            className="btn btn-primary" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            Tamam
          </button>
          <button 
            onClick={() => { toast.dismiss(t.id); resolve(false); }} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--text-muted)', borderColor: 'var(--glass-border)' }}
          >
            İptal
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center', style: { background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--text-main)' } });
  });
};
