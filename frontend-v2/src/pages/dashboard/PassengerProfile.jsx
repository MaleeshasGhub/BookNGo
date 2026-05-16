import React, { useState, useEffect } from 'react';
import PremiumButton from '../../components/PremiumButton';
import InputField from '../../components/InputField';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const PassengerProfile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user?.userId) return;
      try {
        const res = await api.get(`/rides/passenger/${user.userId}`);
        setRides(res.data);
      } catch (err) {
        console.error("Failed to fetch rides", err);
      } finally {
        setLoadingRides(false);
      }
    };
    fetchRides();
  }, [user?.userId]);

  const handleEditClick = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: ''
    });
    setIsEditing(true);
    setError('');
    setSuccess(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put(`/users/${user.userId}`, formData);
      login(response.data); // Update AuthContext with new user details
      setIsEditing(false);
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>My Profile</h2>
      
      {success && (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', 
          padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' 
        }}>
          Profile updated successfully! 🎉
        </div>
      )}

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', 
          padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' 
        }}>
          {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {!isEditing ? (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'var(--gradient-primary)', display: 'flex', 
              justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold' 
            }}>
              {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'JD'}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user?.fullName || 'Loading...'}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{user?.email || 'Loading...'}</p>
              <p style={{ color: 'var(--text-muted)' }}>{user?.phone || 'Loading...'}</p>
            </div>
            <div>
              <PremiumButton variant="secondary" onClick={handleEditClick}>Edit Profile</PremiumButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Edit Your Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <InputField label="New Password (Optional)" type="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <PremiumButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</PremiumButton>
              <PremiumButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </PremiumButton>
            </div>
          </form>
        )}
      </div>

      <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Recent Rides</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {loadingRides ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading rides...</p>
        ) : rides.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>You haven't booked any rides yet.</p>
            <p style={{ fontSize: '0.9rem' }}>When you book a ride, it will show up here.</p>
          </div>
        ) : (
          rides.map((ride, index) => (
            <div key={ride.id || index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '0.3rem', fontSize: '1.1rem' }}>
                  {ride.pickupLocation} to {ride.dropoffLocation}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(ride.createdAt || Date.now()).toLocaleDateString()} • {ride.rideType}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>LKR {ride.fare ? ride.fare.toLocaleString() : '---'}</p>
                <span style={{ 
                  fontSize: '0.8rem', padding: '0.2rem 0.5rem', 
                  background: ride.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                  color: ride.status === 'COMPLETED' ? 'var(--accent)' : 'var(--danger)', 
                  borderRadius: 'var(--radius-pill)', display: 'inline-block', marginTop: '0.3rem' 
                }}>
                  {ride.status || 'PENDING'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PassengerProfile;
