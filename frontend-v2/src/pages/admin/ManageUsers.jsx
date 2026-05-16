import React from 'react';
import PremiumButton from '../../components/PremiumButton';

const ManageUsers = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', rides: 12, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', rides: 4, status: 'Active' },
    { id: 3, name: 'Spam Bot', email: 'spam@bot.com', rides: 0, status: 'Suspended' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Manage Users</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>View and manage passenger accounts.</p>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Total Rides</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>{user.rides}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: 'var(--radius-pill)', 
                    fontSize: '0.8rem',
                    background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: user.status === 'Active' ? 'var(--accent)' : 'var(--danger)'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <PremiumButton variant={user.status === 'Active' ? 'danger' : 'secondary'} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </PremiumButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
