import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import InputField from '../../components/InputField';
import PremiumButton from '../../components/PremiumButton';
import toast from 'react-hot-toast';

// Fix for default Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const BookRide = () => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [booking, setBooking] = useState(false);
  
  // Map State
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [selectingMode, setSelectingMode] = useState('pickup'); // 'pickup' or 'dropoff'

  const navigate = useNavigate();

  // Reverse Geocoding using free OpenStreetMap Nominatim API
  const fetchAddress = async (lat, lng, mode) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const address = res.data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      if (mode === 'pickup') {
        setPickup(address);
        setPickupCoords([lat, lng]);
        setSelectingMode('dropoff'); // Auto-switch to dropoff after picking pickup
      } else {
        setDropoff(address);
        setDropoffCoords([lat, lng]);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      // Fallback
      if (mode === 'pickup') {
        setPickup(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setPickupCoords([lat, lng]);
        setSelectingMode('dropoff');
      } else {
        setDropoff(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setDropoffCoords([lat, lng]);
      }
    }
  };

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        fetchAddress(lat, lng, selectingMode);
      },
    });
    return null;
  };

  const handleBook = async () => {
    if (!pickup || !dropoff || !selectedType) return toast.error('Please fill all fields');
    if (!user) return toast.error('You must be logged in to book a ride');
    
    setBooking(true);
    try {
      const backendRideType = selectedType === 'premium' ? 'PREMIUM' : 'STANDARD';
      
      const res = await axios.post(`/api/rides/book/${user.userId}`, {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        rideType: backendRideType
      });
      
      navigate('/track', { state: { rideId: res.data.rideId } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to book ride: ' + (err.response?.data?.error || err.message));
    } finally {
      setBooking(false);
    }
  };

  const rideTypes = [
    { id: 'eco', name: 'Economy', price: 'LKR 3,750', time: '5 min away' },
    { id: 'premium', name: 'Premium', price: 'LKR 7,200', time: '3 min away' },
    { id: 'suv', name: 'SUV', price: 'LKR 10,500', time: '8 min away' }
  ];

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Book a Ride</h2>
        
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {selectingMode === 'pickup' ? "📍 Tap on the map to set your Pickup Location" : "🎯 Tap on the map to set your Drop-off Location"}
          </p>
          <InputField 
            label="Pickup Location" 
            placeholder="Tap map to set..." 
            value={pickup} 
            onChange={(e) => setPickup(e.target.value)} 
          />
          <InputField 
            label="Drop-off Location" 
            placeholder="Tap map to set..." 
            value={dropoff} 
            onChange={(e) => setDropoff(e.target.value)} 
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <PremiumButton 
              type="button"
              variant={selectingMode === 'pickup' ? 'primary' : 'secondary'} 
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
              onClick={() => setSelectingMode('pickup')}
            >
              Set Pickup
            </PremiumButton>
            <PremiumButton 
              type="button"
              variant={selectingMode === 'dropoff' ? 'primary' : 'secondary'} 
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
              onClick={() => setSelectingMode('dropoff')}
            >
              Set Drop-off
            </PremiumButton>
          </div>
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Select Ride Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {rideTypes.map(type => (
            <div 
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="glass-panel"
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                border: selectedType === type.id ? '2px solid var(--primary)' : 'var(--border-subtle)',
                background: selectedType === type.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(26, 29, 45, 0.6)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'var(--transition-fast)'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{type.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{type.time}</p>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{type.price}</div>
            </div>
          ))}
        </div>

        <PremiumButton variant="primary" style={{ width: '100%' }} onClick={handleBook} disabled={booking}>
          {booking ? 'Booking...' : 'Confirm Booking'}
        </PremiumButton>
      </div>

      <div style={{ flex: '1.5', minWidth: '400px', height: '600px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel-light)', overflow: 'hidden', position: 'relative' }}>
        <MapContainer 
          center={[6.9271, 79.8612]} // Default to Colombo, Sri Lanka (assuming LKR currency)
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Use beautiful dark mode tiles from CartoDB */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapClickHandler />
          
          {pickupCoords && (
            <Marker position={pickupCoords}>
              <Popup>Pickup Location</Popup>
            </Marker>
          )}
          
          {dropoffCoords && (
            <Marker position={dropoffCoords}>
              <Popup>Drop-off Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default BookRide;
