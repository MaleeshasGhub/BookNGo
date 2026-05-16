import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ridesRes] = await Promise.all([
          api.get('/users'),
          api.get('/rides')
        ]);
        setUsers(usersRes.data);
        setRides(ridesRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDrivers = users.filter(u => u.role === 'DRIVER').length;
  const ridesToday = rides.length;

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading Admin Data...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Admin Command Center</h2>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: 'var(--border-subtle)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'users' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('rides')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'rides' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'rides' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Live Rides
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Users</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{users.length}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Drivers</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{totalDrivers}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Rides</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{ridesToday}</h3>
            </div>
          </div>

          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>System Status</h3>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: 'var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Connection</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Healthy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: 'var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>API Server</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Live Requests</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{rides.filter(r => r.status === 'PENDING').length} Pending</span>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{u.userId}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.fullName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: u.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.2)' : u.role === 'DRIVER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: u.role === 'ADMIN' ? 'var(--secondary)' : u.role === 'DRIVER' ? 'var(--accent)' : 'var(--primary)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rides' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Ride ID</th>
                <th style={{ padding: '1rem' }}>Passenger</th>
                <th style={{ padding: '1rem' }}>Route</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map(r => (
                <tr key={r.rideId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{r.rideId}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.passenger?.fullName || 'Unknown'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <div>From: {r.pickupLocation}</div>
                    <div>To: {r.dropoffLocation}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{r.rideType}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: r.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : r.status === 'PENDING' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: r.status === 'COMPLETED' ? 'var(--accent)' : r.status === 'PENDING' ? '#fbbf24' : 'var(--primary)'
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
