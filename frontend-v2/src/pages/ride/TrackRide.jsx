import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PremiumButton from '../../components/PremiumButton';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const TrackRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideId = location.state?.rideId;
  
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) {
      // If someone navigates to /track directly without a rideId, redirect to book
      navigate('/book');
      return;
    }

    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/${rideId}`);
        setRide(res.data);
        if (res.data.status === 'COMPLETED') {
          navigate('/payment', { state: { amount: res.data.fare || 0, rideType: res.data.rideType || 'Standard', rideId: res.data.rideId } });
        }
      } catch (err) {
        console.error("Failed to fetch ride details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
    // Poll the backend every 5 seconds to get updates (e.g., driver accepting)
    const interval = setInterval(fetchRide, 5000);
    return () => clearInterval(interval);
  }, [rideId, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-muted)' }}>Loading ride details...</div>;
  }

  if (!ride) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--danger)' }}>Ride not found.</div>;
  }

  const isPending = ride.status === 'PENDING';

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          {isPending ? 'Searching for Driver' : 'Driver is En Route'}
        </h2>
        
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          {isPending ? (
            <div style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem', animation: 'pulse 2s infinite' }}>
              Locating nearby drivers...
            </div>
          ) : (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>4 min</div>
              <p style={{ color: 'var(--text-muted)' }}>Estimated arrival</p>
            </>
          )}
        </div>

        {!isPending && ride.driver ? (
          <>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Driver Details</h3>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                {ride.driver.fullName ? ride.driver.fullName.substring(0, 2).toUpperCase() : 'DR'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.2rem' }}>{ride.driver.fullName}</h4>
                <p style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.2rem' }}>4.9 ★</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ride.driver.vehicleType} • {ride.driver.plateNumber}</p>
              </div>
            </div>
          </>
        ) : (
           <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
             Your request has been broadcasted to available drivers in the area. Please wait...
           </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isPending && <PremiumButton variant="secondary" style={{ flex: 1 }}>Call Driver</PremiumButton>}
          <PremiumButton variant="danger" style={{ flex: 1 }} onClick={async () => {
             try {
               await api.delete(`/rides/${rideId}/cancel`);
               toast.success("Ride cancelled successfully");
               navigate('/profile');
             } catch(err) {
               toast.error("Failed to cancel ride");
             }
          }}>Cancel Ride</PremiumButton>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>For testing purposes:</p>
            <PremiumButton variant="primary" onClick={() => navigate('/payment')}>Simulate Ride Completion</PremiumButton>
        </div>
      </div>

      <div style={{ flex: '1.5', minWidth: '400px', height: '600px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #2a2d42 0%, var(--bg-dark) 100%)', opacity: 0.5 }}></div>
        <div style={{ zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📍</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Live GPS Tracking Map</p>
          <p style={{ color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 'bold' }}>Ride #{ride.rideId}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackRide;
