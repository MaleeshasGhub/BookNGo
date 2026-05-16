import React from 'react';
import PremiumButton from '../../components/PremiumButton';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const payments = [
    { id: 'TXN-001', date: 'May 14, 2026', amount: 'LKR 7,200', method: 'Credit Card', status: 'Completed' },
    { id: 'TXN-002', date: 'May 10, 2026', amount: 'LKR 3,750', method: 'PayPal', status: 'Completed' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Payment History</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A record of all your past transactions.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {payments.map(payment => (
          <div key={payment.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{payment.id}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{payment.date} • {payment.method}</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.2rem' }}>{payment.amount}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{payment.status}</span>
              </div>
              <PremiumButton variant="secondary" onClick={() => navigate('/invoice')}>View Invoice</PremiumButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
