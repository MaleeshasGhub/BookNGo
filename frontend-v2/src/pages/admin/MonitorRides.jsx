import React from 'react';

const MonitorRides = () => {
  const activeRides = [
    { id: 'R-1001', passenger: 'John Doe', driver: 'Alice', status: 'In Progress', eta: '4 min' },
    { id: 'R-1002', passenger: 'Jane Smith', driver: 'Waiting...', status: 'Looking for Driver', eta: '--' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Live Map Feed</h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitor all active rides in the system.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }}></div>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeRides.map(ride => (
            <div key={ride.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: ride.status === 'In Progress' ? '4px solid var(--accent)' : '4px solid #fbbf24' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>{ride.id}</span>
                <span style={{ fontSize: '0.9rem', color: ride.status === 'In Progress' ? 'var(--accent)' : '#fbbf24' }}>{ride.status}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pass: {ride.passenger}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Driver: {ride.driver}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>ETA: {ride.eta}</div>
            </div>
          ))}
        </div>
        <div className="glass-panel" style={{ flex: '2', minWidth: '400px', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, transparent 100%)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🌍</div>
            <p style={{ color: 'var(--text-muted)' }}>Admin Map View</p>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default MonitorRides;
