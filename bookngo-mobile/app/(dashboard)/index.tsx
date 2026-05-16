import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import MapView, { Marker } from '../../components/Map';
import api from '../../api/axios';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function BookRideScreen() {
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoord, setPickupCoord] = useState<{latitude: number, longitude: number} | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectingMode, setSelectingMode] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedType, setSelectedType] = useState('bicycle');
  const [booking, setBooking] = useState(false);
  const [activeRide, setActiveRide] = useState<any>(null);

  // Check for existing active rides on mount
  React.useEffect(() => {
    const checkActiveRide = async () => {
      if (user?.userId) {
        try {
          const res = await api.get(`/rides/passenger/${user.userId}`);
          const active = res.data.find((r: any) => ['PENDING', 'ACCEPTED', 'ONGOING'].includes(r.status));
          if (active) setActiveRide(active);
        } catch (err) {}
      }
    };
    checkActiveRide();
  }, [user?.userId]);

  // Poll for ride status updates
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeRide && activeRide.rideId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/rides/${activeRide.rideId}`);
          const ride = res.data;
          setActiveRide(ride);
          
          if (ride.status === 'COMPLETED') {
            clearInterval(interval);
            const priceStr = ride.fare?.toString() || '0';
            const typeStr = ride.rideType || 'Unknown';
            router.replace({ pathname: '/payment', params: { amount: priceStr, rideType: typeStr, rideId: String(ride.rideId) } });
          } else if (ride.status === 'CANCELLED') {
            clearInterval(interval);
            setActiveRide(null);
            Alert.alert('Ride Cancelled', 'Your ride has been cancelled.');
          }
        } catch (err) {
          console.error("Failed to poll ride status", err);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRide?.rideId]);

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const addr = geocode[0];
        const parts = [addr.name, addr.street, addr.city].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (e) {
      console.warn('Geocoding failed', e);
    }
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const handleMapPress = async (e: any) => {
    const coord = e.nativeEvent.coordinate;
    if (selectingMode === 'pickup') {
      setPickupCoord(coord);
      setPickup('Loading address...');
      const address = await getAddressFromCoords(coord.latitude, coord.longitude);
      setPickup(address);
      if (!dropoffCoord) {
        setSelectingMode('dropoff');
      }
    } else {
      setDropoffCoord(coord);
      setDropoff('Loading address...');
      const address = await getAddressFromCoords(coord.latitude, coord.longitude);
      setDropoff(address);
    }
  };

  const distanceKm = useMemo(() => {
    if (!pickupCoord || !dropoffCoord) return null;
    const R = 6371; // Earth radius in km
    const dLat = (dropoffCoord.latitude - pickupCoord.latitude) * (Math.PI / 180);
    const dLon = (dropoffCoord.longitude - pickupCoord.longitude) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickupCoord.latitude * (Math.PI / 180)) * Math.cos(dropoffCoord.latitude * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [pickupCoord, dropoffCoord]);

  const rideTypes = useMemo(() => {
    const dist = distanceKm || 5; // Default distance for initial render
    const getPrice = (ratePerKm: number, baseFare: number) => {
      const price = baseFare + (dist * ratePerKm);
      return `LKR ${Math.round(price).toLocaleString()}`;
    };
    const getTime = (speedKmph: number) => {
      const minutes = Math.max(1, Math.round((dist / speedKmph) * 60));
      return `${minutes} min`;
    };

    return [
      { id: 'bicycle', name: 'Bicycle', price: getPrice(80, 200), time: getTime(15) },
      { id: 'tuk', name: 'Three Wheeler', price: getPrice(120, 300), time: getTime(25) },
      { id: 'suv', name: 'SUV', price: getPrice(350, 1000), time: getTime(40) },
    ];
  }, [distanceKm]);

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      return Alert.alert('Error', 'Please enter pickup and dropoff locations.');
    }
    if (!user?.userId) {
      return Alert.alert('Error', 'Session expired. Please log out and log in again.');
    }
    setBooking(true);
    try {
      // Backend only accepts STANDARD or PREMIUM
      const backendRideType = selectedType === 'bicycle' ? 'STANDARD' : 'PREMIUM';
      
      const priceStr = rideTypes.find(r => r.id === selectedType)?.price.replace('LKR ', '') || '1,500';
      const typeStr = rideTypes.find(r => r.id === selectedType)?.name || 'Three Wheeler';

      const response = await api.post(`/rides/book/${user.userId}`, {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        rideType: backendRideType
      });
      
      setActiveRide(response.data);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to book ride';
      if (Platform.OS === 'web') {
        window.alert('Error: ' + msg);
      } else {
        Alert.alert('Booking Failed', typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Where to, {user?.fullName?.split(' ')[0] || 'there'}?</Text>

        <Text style={styles.instructionText}>
          {selectingMode === 'pickup' ? '📍 Tap map to set Pickup location' : '🚩 Tap map to set Dropoff location'}
        </Text>

        {Platform.OS === 'web' ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Interactive Map disabled on Web.</Text>
            <Text style={styles.mapPlaceholderSubtext}>(Fully functional natively on iOS/Android)</Text>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: 6.9271,
                longitude: 79.8612,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              {pickupCoord && (
                <Marker 
                  draggable
                  coordinate={pickupCoord} 
                  title="Pickup" 
                  pinColor="green" 
                  onDragEnd={async (e) => {
                    const coord = e.nativeEvent.coordinate;
                    setPickupCoord(coord);
                    setPickup('Loading address...');
                    const address = await getAddressFromCoords(coord.latitude, coord.longitude);
                    setPickup(address);
                  }}
                />
              )}
              {dropoffCoord && (
                <Marker 
                  draggable
                  coordinate={dropoffCoord} 
                  title="Dropoff" 
                  pinColor="red" 
                  onDragEnd={async (e) => {
                    const coord = e.nativeEvent.coordinate;
                    setDropoffCoord(coord);
                    setDropoff('Loading address...');
                    const address = await getAddressFromCoords(coord.latitude, coord.longitude);
                    setDropoff(address);
                  }}
                />
              )}
            </MapView>
          </View>
        )}
        
        {activeRide ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32, borderColor: '#6366f1', borderWidth: 2 }]}>
            <ActivityIndicator size="large" color="#6366f1" style={{ marginBottom: 20 }} />
            <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              {activeRide.status === 'PENDING' ? 'Searching for drivers...' : 'Driver is on the way!'}
            </Text>
            <Text style={{ color: '#9ca3af', marginBottom: 24, textAlign: 'center', fontSize: 16 }}>
              {activeRide.status === 'PENDING' 
                ? 'Please wait while we connect you to a nearby driver.' 
                : `Your driver has accepted the ride.\nFare: LKR ${activeRide.fare?.toLocaleString()}`
              }
            </Text>
            {activeRide.status === 'PENDING' && (
              <TouchableOpacity 
                style={[styles.bookButton, { backgroundColor: '#ef4444', width: '100%' }]} 
                onPress={async () => {
                  try {
                    await api.delete(`/rides/${activeRide.rideId}/cancel`);
                    setActiveRide(null);
                  } catch (err) {
                    Alert.alert('Error', 'Failed to cancel ride');
                  }
                }}
              >
                <Text style={styles.bookButtonText}>Cancel Request</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.glassPanel}>
              <TextInput 
                style={[styles.input, selectingMode === 'pickup' && styles.inputActive]}
                placeholder="Current Location"
                placeholderTextColor="#6b7280"
                value={pickup}
                onChangeText={setPickup}
                onFocus={() => setSelectingMode('pickup')}
              />
              <View style={styles.divider} />
              <TextInput 
                style={[styles.input, selectingMode === 'dropoff' && styles.inputActive]}
                placeholder="Where to?"
                placeholderTextColor="#6b7280"
                value={dropoff}
                onChangeText={setDropoff}
                onFocus={() => setSelectingMode('dropoff')}
              />
            </View>

            <View style={styles.rideSectionHeader}>
              <Text style={styles.sectionTitle}>Ride Type</Text>
              {distanceKm !== null && (
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceBadgeText}>{distanceKm.toFixed(1)} km</Text>
                </View>
              )}
            </View>
            <View style={styles.rideTypesContainer}>
              {rideTypes.map((ride) => (
                <TouchableOpacity 
                  key={ride.id} 
                  style={[styles.rideTypeCard, selectedType === ride.id && styles.rideTypeCardSelected]}
                  onPress={() => setSelectedType(ride.id)}
                >
                  <Text style={styles.rideTypeName}>{ride.name}</Text>
                  <Text style={styles.rideTypePrice}>{ride.price}</Text>
                  <Text style={styles.rideTypeTime}>{ride.time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookRide} disabled={booking}>
              <Text style={styles.bookButtonText}>{booking ? 'Requesting...' : `Request ${rideTypes.find(r => r.id === selectedType)?.name}`}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f111a',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 20,
  },
  instructionText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(26, 29, 45, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderStyle: 'dashed',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    color: '#9ca3af',
    fontSize: 12,
  },
  glassPanel: {
    backgroundColor: 'rgba(26, 29, 45, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  input: {
    color: '#ffffff',
    padding: 12,
    fontSize: 16,
  },
  inputActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  rideSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  distanceBadgeText: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rideTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  rideTypeCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 45, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  rideTypeCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  rideTypeName: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rideTypePrice: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  rideTypeTime: {
    color: '#9ca3af',
    fontSize: 12,
  },
  bookButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
