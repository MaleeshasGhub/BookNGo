import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform, Modal, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { router } from 'expo-router';

export default function DriverProfileScreen() {
  const { user, logout } = useAuth();
  const [pastRides, setPastRides] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', vehicleType: '', vehiclePlate: '' });

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

  const openEditModal = () => {
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      vehicleType: user?.vehicleType || '',
      vehiclePlate: user?.vehiclePlate || ''
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/drivers/${user?.userId}`, formData);
      setEditModalVisible(false);
      if (Platform.OS === 'web') window.alert('Profile updated! Please log in again to see changes.');
      else Alert.alert('Success', 'Profile updated! Please log in again to see changes.');
      // Optionally logout or refresh user context here
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert(err.response?.data?.error || 'Failed to update profile');
      else Alert.alert('Error', err.response?.data?.error || 'Failed to update profile');
    }
  };

  const executeDeleteAccount = async () => {
    try {
      await api.delete(`/drivers/${user?.userId}`);
      await logout();
      if (Platform.OS === 'web') window.location.href = '/';
      else router.replace('/');
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert('Failed to delete account');
      else Alert.alert('Error', 'Failed to delete account');
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to PERMANENTLY delete your account? This action cannot be undone.');
      if (confirmed) {
        executeDeleteAccount();
      }
    } else {
      Alert.alert('Delete Account', 'Are you sure you want to PERMANENTLY delete your account? This action cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Forever', style: 'destructive', onPress: executeDeleteAccount }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Driver Profile</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={openEditModal}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.profileSubtext}>{user?.vehicleType} - {user?.vehiclePlate}</Text>
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
        
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountText}>Delete My Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Vehicle Type (e.g. Tuk Tuk)"
              placeholderTextColor="#6b7280"
              value={formData.vehicleType}
              onChangeText={(text) => setFormData({...formData, vehicleType: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Vehicle Plate"
              placeholderTextColor="#6b7280"
              value={formData.vehiclePlate}
              onChangeText={(text) => setFormData({...formData, vehiclePlate: text})}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  editText: { color: '#6366f1', fontSize: 16, fontWeight: '600' },
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
  deleteAccountButton: { marginTop: 32, marginBottom: 40, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(239,68,68,0.2)', alignItems: 'center' },
  deleteAccountText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1a1d2d', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center' },
  cancelButtonText: { color: '#ffffff', fontWeight: 'bold' },
  saveButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#6366f1', alignItems: 'center' },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold' },
});
