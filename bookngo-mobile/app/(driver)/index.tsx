import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function DriverDashboardScreen() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [pastRides, setPastRides] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnline) {
      fetchData();
      interval = setInterval(fetchData, 5000);
    } else {
      setPendingRides([]);
      setActiveRide(null);
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  const fetchData = async () => {
    try {
      // 1. Fetch the driver's active rides
      if (user?.userId) {
        const myRidesRes = await api.get(`/rides/driver/${user.userId}`);
        const current = myRidesRes.data.find((r: any) => r.status === 'ACCEPTED' || r.status === 'ONGOING');
        setActiveRide(current || null);
        setPastRides(myRidesRes.data);
        
        const revRes = await api.get(`/reviews/driver/${user.userId}`);
        setReviews(revRes.data);
      }
      
      // 2. Fetch pending rides if not currently busy
      const pendingRes = await api.get('/rides/pending');
      setPendingRides(pendingRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const totalEarnings = pastRides
    .filter(r => r.status === 'COMPLETED' && r.fare)
    .reduce((sum, r) => sum + r.fare, 0);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  const handleAcceptRide = async (rideId: number) => {
    try {
      await api.put(`/rides/${rideId}/status`, {
        status: 'ACCEPTED',
        driverId: user?.userId?.toString()
      });
      Alert.alert('Success', 'Ride Accepted! Please proceed to pickup.');
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to accept ride: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCompleteRide = async () => {
    if (!activeRide) return;
    try {
      await api.put(`/rides/${activeRide.rideId}/status`, {
        status: 'COMPLETED',
        driverId: user?.userId?.toString()
      });
      Alert.alert('Success', 'Ride completed successfully!');
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to complete ride: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: isOnline ? '#10b981' : '#9ca3af' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <TouchableOpacity 
              style={[styles.toggleButton, { backgroundColor: isOnline ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)' }]}
              onPress={() => setIsOnline(!isOnline)}
            >
              <Text style={[styles.toggleText, { color: isOnline ? '#ef4444' : '#10b981' }]}>
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Earnings</Text>
            <Text style={styles.statValue}>LKR {totalEarnings.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={[styles.statValue, { color: '#fbbf24' }]}>{avgRating} ★</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{activeRide ? 'Current Ride' : 'Active Requests'}</Text>

        {isOnline ? (
          activeRide ? (
            <View style={[styles.rideCard, { borderColor: '#10b981', borderWidth: 2 }]}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideId}>Ride #{activeRide.rideId} (ONGOING)</Text>
                <Text style={styles.rideText}><Text style={styles.bold}>From:</Text> {activeRide.pickupLocation}</Text>
                <Text style={styles.rideText}><Text style={styles.bold}>To:</Text> {activeRide.dropoffLocation}</Text>
                <Text style={[styles.rideText, { marginTop: 8, color: '#10b981', fontWeight: 'bold' }]}>
                  Fare: LKR {activeRide.fare?.toLocaleString() || '---'}
                </Text>
              </View>
              <View style={styles.rideActions}>
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteRide}>
                  <Text style={styles.acceptText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : pendingRides.length > 0 ? (
            pendingRides.map(ride => (
              <View key={ride.rideId} style={styles.rideCard}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideId}>Ride #{ride.rideId}</Text>
                  <Text style={styles.rideText}><Text style={styles.bold}>From:</Text> {ride.pickupLocation}</Text>
                  <Text style={styles.rideText}><Text style={styles.bold}>To:</Text> {ride.dropoffLocation}</Text>
                </View>
                <View style={styles.rideActions}>
                  <Text style={styles.rideType}>{ride.rideType}</Text>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRide(ride.rideId)}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Waiting for ride requests in your area...</Text>
            </View>
          )
        ) : (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>You are currently offline. Go online to receive requests.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusText: { fontWeight: '600', fontSize: 14 },
  toggleButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  toggleText: { fontWeight: 'bold', fontSize: 14 },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statLabel: { color: '#9ca3af', fontSize: 12, marginBottom: 8 },
  statValue: { color: '#10b981', fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  rideCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  rideInfo: { flex: 1 },
  rideId: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  rideText: { color: '#d1d5db', fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#9ca3af' },
  rideActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  rideType: { color: '#10b981', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  acceptButton: { backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  completeButton: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  acceptText: { color: '#ffffff', fontWeight: 'bold' },
  loadingContainer: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#10b981', borderStyle: 'dashed' },
  loadingText: { color: '#9ca3af', marginTop: 16, textAlign: 'center' },
  offlineContainer: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 32, alignItems: 'center' },
  offlineText: { color: '#9ca3af', textAlign: 'center' },
});
