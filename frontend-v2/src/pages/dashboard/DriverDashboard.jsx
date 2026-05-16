import React, { useState, useEffect } from 'react';
import PremiumButton from '../../components/PremiumButton';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [pendingRides, setPendingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchDriverHistory();
  }, []);

  useEffect(() => {
    let interval;
    if (isOnline) {
      fetchPendingRides();
      interval = setInterval(fetchPendingRides, 5000);
    } else {
      setPendingRides([]);
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  const fetchPendingRides = async () => {
    try {
      const res = await api.get('/rides/pending');
      setPendingRides(res.data);
    } catch (err) {
      console.error('Failed to fetch pending rides:', err);
    }
  };

  const fetchDriverHistory = async () => {
    try {
      const res = await api.get(`/rides/driver/${user.userId}`);
      setPastRides(res.data);
      const revRes = await api.get(`/reviews/driver/${user.userId}`);
      setReviews(revRes.data);
    } catch (err) {
      console.error('Failed to fetch driver data:', err);
    }
  };

  const totalEarnings = pastRides
    .filter(r => r.status === 'COMPLETED' && r.fare)
    .reduce((sum, r) => sum + r.fare, 0);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  const handleAcceptRide = async (rideId) => {
    try {
      await api.put(`/rides/${rideId}/status`, {
        status: 'ACCEPTED',
        driverId: user.userId
      });
      toast.success('Ride Accepted! Please proceed to pickup.');
      fetchPendingRides();
      fetchDriverHistory();
    } catch (err) {
      toast.error('Failed to accept ride: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Driver Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: isOnline ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '600' }}>
            {isOnline ? 'Online & Ready' : 'Offline'}
          </span>
          <PremiumButton 
            variant={isOnline ? 'danger' : 'primary'} 
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </PremiumButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Earnings</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '0.5rem' }}>LKR {totalEarnings.toLocaleString()}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Completed Rides</p>
          <h3 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{pastRides.filter(r => r.status === 'COMPLETED').length}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rating</p>
          <h3 style={{ fontSize: '2rem', color: '#fbbf24', marginTop: '0.5rem' }}>{avgRating} ★</h3>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Active Ride Requests</h3>
      {isOnline ? (
        pendingRides.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRides.map(ride => (
              <div key={ride.rideId} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ride #{ride.rideId}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><strong>From:</strong> {ride.pickupLocation}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><strong>To:</strong> {ride.dropoffLocation}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>{ride.rideType}</div>
                  <PremiumButton variant="accent" onClick={() => handleAcceptRide(ride.rideId)}>Accept Ride</PremiumButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--primary)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Waiting for ride requests in your area...
            <style>
              {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          You are currently offline. Go online to receive requests.
        </div>
      )}

      <h3 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Your Accepted Rides</h3>
      {pastRides.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pastRides.map(ride => (
            <div key={ride.rideId} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>{new Date(ride.bookedAt).toLocaleString()}</span>
                <span style={{ color: ride.status === 'COMPLETED' ? 'var(--accent)' : 'var(--primary)', fontWeight: 'bold' }}>{ride.status}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>From: {ride.pickupLocation}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>To: {ride.dropoffLocation}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>No recent rides.</p>
      )}
    </div>
  );
};

export default DriverDashboard;
