import React from 'react';
import PremiumButton from '../../components/PremiumButton';

const ManageDrivers = () => {
  const drivers = [
    { id: 1, name: 'Alice Johnson', car: 'Toyota Camry', license: 'VERIFIED', status: 'Approved' },
    { id: 2, name: 'Bob Smith', car: 'Honda Civic', license: 'PENDING', status: 'Pending' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Driver Applications</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review driver documents and approve accounts.</p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {drivers.map(driver => (
          <div key={driver.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{driver.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vehicle: {driver.car}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.8rem',
                  border: driver.license === 'VERIFIED' ? '1px solid var(--accent)' : '1px solid #fbbf24',
                  color: driver.license === 'VERIFIED' ? 'var(--accent)' : '#fbbf24'
                }}>
                  License: {driver.license}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <PremiumButton variant="secondary">View Docs</PremiumButton>
              {driver.status === 'Pending' ? (
                <PremiumButton variant="primary">Approve</PremiumButton>
              ) : (
                <PremiumButton variant="danger">Revoke</PremiumButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDrivers;
