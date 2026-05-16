import React from 'react';
import PremiumButton from '../../components/PremiumButton';

const Invoice = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Invoice TXN-001</h2>
        <PremiumButton variant="primary">Download PDF</PremiumButton>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', background: '#ffffff', color: '#1a1d2d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '0.5rem' }}>BookNGo</h1>
            <p style={{ color: '#4b5563' }}>123 Taxi Street, Colombo, Sri Lanka</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '0.5rem' }}>Billed To:</h3>
            <p style={{ fontWeight: 'bold' }}>John Doe</p>
            <p style={{ color: '#4b5563' }}>john@example.com</p>
            <p style={{ color: '#4b5563', marginTop: '1rem' }}>Date: May 14, 2026</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Description</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1rem 0' }}>Base Fare</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>LKR 1,500</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1rem 0' }}>Distance (4.2 miles)</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>LKR 3,750</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1rem 0' }}>Time (14 mins)</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>LKR 1,200</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0', color: '#6b7280' }}>Taxes & Fees</td>
              <td style={{ padding: '1rem 0', textAlign: 'right', color: '#6b7280' }}>LKR 750</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#6366f1' }}>LKR 7,200</span>
            </div>
            <p style={{ textAlign: 'right', color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Paid via Credit Card ending in 4242</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
