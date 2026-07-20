import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onSubmit: () => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSubmit, amount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing...
    onSubmit();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: '1rem',
      animation: 'pageFadeIn 0.3s ease-out forwards'
    }}>
      <div style={{
        background: 'var(--bg-main)', borderRadius: '24px', width: '100%', maxWidth: '900px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent',
          border: 'none', cursor: 'pointer', color: 'var(--text-muted)', zIndex: 10
        }}>
          <X size={24} />
        </button>

        {/* Left Side: 3D Card Simulation */}
        <div style={{ background: '#EAEAEA', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          <div className="card-perspective" style={{ width: '100%', maxWidth: '380px', aspectRatio: '1.586/1' }}>
            <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
              
              {/* Front of Card */}
              <div className="card-front" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="card-chip"></div>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: '1.6rem', letterSpacing: '0.15em', fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.3)', marginBottom: '1rem' }}>
                    {cardNumber || '#### #### #### ####'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', textTransform: 'uppercase' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.7, marginBottom: '2px' }}>Kart Sahibi</div>
                      <div style={{ fontSize: '1rem', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {cardHolder || 'AD SOYAD'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.7, marginBottom: '2px' }}>SKT</div>
                      <div style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>
                        {expiry || 'AA/YY'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div className="card-stripe"></div>
                <div className="card-cvv-box">{cvv || '***'}</div>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.65rem', opacity: 0.5, width: '80%' }}>
                  Bu kart sadece simülasyon amaçlıdır.
                </div>
              </div>
              
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Toplam Ödenecek Tutar
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              ₺{amount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Güvenli Ödeme</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Lütfen kredi kartı bilgilerinizi giriniz.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label">Kart Üzerindeki İsim</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ background: '#FFF' }}
                value={cardHolder} 
                onChange={e => setCardHolder(e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '').toUpperCase())}
                onFocus={() => setIsFlipped(false)}
                required
                maxLength={30}
              />
            </div>
            
            <div>
              <label className="form-label">Kart Numarası</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ background: '#FFF', fontFamily: 'monospace', fontSize: '1.1rem' }}
                value={cardNumber} 
                onChange={handleCardNumberChange}
                onFocus={() => setIsFlipped(false)}
                required
                maxLength={19}
                placeholder="0000 0000 0000 0000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Son Kulanma (AA/YY)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ background: '#FFF', textAlign: 'center' }}
                  value={expiry} 
                  onChange={handleExpiryChange}
                  onFocus={() => setIsFlipped(false)}
                  required
                  maxLength={5}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="form-label">CVV</label>
                <input 
                  type="password" 
                  className="form-control" 
                  style={{ background: '#FFF', textAlign: 'center', letterSpacing: '0.2em' }}
                  value={cvv} 
                  onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  required
                  maxLength={3}
                  placeholder="***"
                />
              </div>
            </div>

            <button type="submit" style={{ 
              marginTop: '1.5rem', width: '100%', padding: '1.1rem', background: 'var(--primary)', 
              color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '1.05rem', 
              fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', 
              alignItems: 'center', gap: '0.6rem', transition: 'all 0.3s ease', 
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)' 
            }}>
              <CheckCircle size={20} /> Ödemeyi Tamamla
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
