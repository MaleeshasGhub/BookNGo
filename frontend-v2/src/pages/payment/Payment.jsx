import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PremiumButton from '../../components/PremiumButton';
import toast from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Receipt Side */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Ride Completed</h2>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Receipt Breakdown</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Base Fare</span>
              <span>LKR 1,500</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Distance (4.2 miles)</span>
              <span>LKR 3,750</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Time (14 mins)</span>
              <span>LKR 1,200</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <span>Taxes & Fees</span>
              <span>LKR 750</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>LKR 7,200</span>
            </div>
          </div>
        </div>

        {/* Payment Form Side */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Payment Method</h2>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, padding: '1rem', border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>Credit Card</div>
              <div style={{ flex: 1, padding: '1rem', border: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>PayPal</div>
            </div>

            <InputField label="Cardholder Name" placeholder="John Doe" />
            <InputField label="Card Number" placeholder="**** **** **** 4242" />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <InputField label="Expiry Date" placeholder="MM/YY" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <InputField label="CVC" placeholder="123" />
              </div>
            </div>

            <PremiumButton variant="primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={handlePayment}>
              Pay LKR 7,200
            </PremiumButton>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Payment;
