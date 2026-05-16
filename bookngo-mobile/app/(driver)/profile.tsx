import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { router } from 'expo-router';

export default function DriverProfileScreen() {
  const { user, logout } = useAuth();
  const [pastRides, setPastRides] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user?.userId) return;
    try {
      const [ridesRes, reviewsRes] = await Promise.all([
        api.get(`/rides/driver/${user.userId}`),
        api.get(`/reviews/driver/${user.userId}`)
      ]);
      setPastRides(ridesRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error('Failed to fetch driver data:', err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        await logout();
        window.location.href = '/';
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Driver Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassPanel}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'DR'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{user?.fullName || 'Loading...'}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {avgRating}</Text>
                </View>
              </View>
              <Text style={styles.profileSubtext}>{user?.email}</Text>
              <Text style={styles.profileSubtext}>{user?.phone}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your History</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
        ) : pastRides.length === 0 ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32 }]}>
            <Text style={styles.noDataText}>No rides completed yet.</Text>
          </View>
        ) : (
          pastRides.slice(0, 5).map((ride, index) => (
            <View key={ride.id || index} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideDate}>{new Date(ride.bookedAt || ride.createdAt || Date.now()).toLocaleString()}</Text>
                <Text style={[styles.rideStatus, ride.status === 'COMPLETED' ? styles.statusCompleted : styles.statusAccepted]}>
                  {ride.status}
                </Text>
              </View>
              <Text style={styles.rideText}><Text style={styles.bold}>From:</Text> {ride.pickupLocation}</Text>
              <Text style={styles.rideText}><Text style={styles.bold}>To:</Text> {ride.dropoffLocation}</Text>
              <View style={styles.rideFooter}>
                <Text style={styles.rideType}>{ride.rideType}</Text>
                {ride.fare && <Text style={styles.rideFare}>LKR {ride.fare.toLocaleString()}</Text>}
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Passenger Feedback</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
        ) : reviews.length === 0 ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32 }]}>
            <Text style={styles.noDataText}>No reviews yet.</Text>
          </View>
        ) : (
          reviews.map((rev) => rev.isHidden ? null : (
            <View key={rev.reviewId} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewPassenger}>{rev.passenger?.fullName}</Text>
                <Text style={styles.reviewStars}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              {rev.verified && <Text style={styles.verifiedText}>✓ Verified Ride</Text>}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 24 },
  profileInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  ratingBadge: { backgroundColor: 'rgba(251, 191, 36, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 12 },
  profileSubtext: { fontSize: 14, color: '#9ca3af' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  noDataText: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  rideCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rideDate: { color: '#ffffff', fontWeight: 'bold' },
  rideStatus: { fontWeight: 'bold', fontSize: 12 },
  statusCompleted: { color: '#10b981' },
  statusAccepted: { color: '#6366f1' },
  rideText: { color: '#d1d5db', fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#9ca3af' },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  rideType: { color: '#10b981', fontWeight: '600' },
  rideFare: { color: '#ffffff', fontWeight: 'bold' },
  reviewCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderLeftWidth: 3, borderLeftColor: '#fbbf24' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reviewPassenger: { color: '#ffffff', fontWeight: 'bold' },
  reviewStars: { color: '#fbbf24', letterSpacing: 2 },
  reviewComment: { color: '#d1d5db', fontStyle: 'italic', marginBottom: 8 },
  verifiedText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
});
