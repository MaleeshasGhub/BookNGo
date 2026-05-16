import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PremiumButton from '../../components/PremiumButton';
import api from '../../api/axios';

const DriverRegister = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', vehicleType: '', plateNumber: '', licenseNumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    
    try {
      await api.post('/drivers/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: 'DRIVER',
        vehicleType: formData.vehicleType,
        vehiclePlate: formData.plateNumber,
        licenseNumber: formData.licenseNumber || ('LIC-' + Math.floor(Math.random() * 10000))
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Drive with Us</h2>
          <p style={{ color: 'var(--text-muted)' }}>Become a BookNGo Driver</p>
        </div>

        {success && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid var(--accent)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '0.2rem', fontSize: '1.2rem' }}>Application Submitted! 🎉</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Redirecting you to login...</p>
          </div>
        )}

        {error && !success && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField label="Full Name" name="fullName" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} required />
            <InputField label="Phone Number" name="phone" placeholder="123-456-7890" value={formData.phone} onChange={handleChange} required />
            <InputField label="Email Address" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', gridColumn: 'span 1' }}>
              <InputField label="Password" type="password" name="password" placeholder="Create" value={formData.password} onChange={handleChange} required />
              <InputField label="Confirm" type="password" name="confirmPassword" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <InputField label="Vehicle Type" name="vehicleType" placeholder="e.g. Sedan, SUV" value={formData.vehicleType} onChange={handleChange} required />
            <InputField label="License Plate" name="plateNumber" placeholder="ABC-1234" value={formData.plateNumber} onChange={handleChange} required />
          </div>
          
          <PremiumButton type="submit" variant="primary" style={{ width: '100%', marginTop: '2rem', background: 'var(--accent)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </PremiumButton>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
