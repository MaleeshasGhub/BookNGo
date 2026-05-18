import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PassengerProfileScreen() {
  const { user, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [rides, setRides] = useState<any[]>([]);
  const [loadingRides, setLoadingRides] = useState(true);

  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    fetchRides();
    fetchPayments();
  }, []);

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

  const fetchPayments = async () => {
    if (!user?.userId) return;
    try {
      const res = await api.get(`/payments/passenger/${user.userId}`);
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/payments/${paymentId}`);
        fetchPayments();
      } catch (err: any) {
        if (Platform.OS === 'web') window.alert(err.response?.data?.error || 'Failed to delete payment');
        else Alert.alert('Error', err.response?.data?.error || 'Failed to delete payment');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this payment from your history?')) {
        executeDelete();
      }
    } else {
      Alert.alert('Delete Payment', 'Are you sure you want to remove this payment from your history?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: executeDelete }
      ]);
    }
  };

  const handleDeleteRide = async (rideId: number) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/rides/${rideId}`);
        fetchRides();
        fetchPayments(); // Refresh payments as well in case they changed
      } catch (err: any) {
        if (Platform.OS === 'web') window.alert(err.response?.data?.error || 'Failed to delete ride');
        else Alert.alert('Error', err.response?.data?.error || 'Failed to delete ride');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this ride from your history? Associated payments and reviews will also be removed.')) {
        executeDelete();
      }
    } else {
      Alert.alert('Delete Ride', 'Are you sure you want to remove this ride from your history? Associated payments and reviews will also be removed.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: executeDelete }
      ]);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/users/${user?.userId}`, formData);
      await login(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully! 🎉');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

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

  const executeDeleteAccount = async () => {
    try {
      await api.delete(`/users/${user?.userId}`);
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
      Alert.alert('Delete Account', 'Are you sure you want to PERMANENTLY delete your account?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Forever', style: 'destructive', onPress: executeDeleteAccount }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassPanel}>
          {!isEditing ? (
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'JD'}
                </Text>
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{user?.fullName || 'Loading...'}</Text>
                <Text style={styles.profileSubtext}>{user?.email || 'Loading...'}</Text>
                <Text style={styles.profileSubtext}>{user?.phone || 'Loading...'}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editContainer}>
              <Text style={styles.sectionTitle}>Edit Your Details</Text>
              <TextInput 
                style={styles.input} placeholder="Full Name" placeholderTextColor="#6b7280"
                value={formData.fullName} onChangeText={(val) => handleChange('fullName', val)}
              />
              <TextInput 
                style={styles.input} placeholder="Phone Number" placeholderTextColor="#6b7280"
                value={formData.phone} onChangeText={(val) => handleChange('phone', val)} keyboardType="phone-pad"
              />
              <TextInput 
                style={styles.input} placeholder="Email Address" placeholderTextColor="#6b7280"
                value={formData.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" autoCapitalize="none"
              />
              <View style={styles.passwordWrapper}>
                <TextInput 
                  style={styles.passwordInput} placeholder="New Password (Optional)" placeholderTextColor="#6b7280"
                  value={formData.password} onChangeText={(val) => handleChange('password', val)} secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave} disabled={loading}>
                  <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Recent Rides</Text>
        
        {loadingRides ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
        ) : rides.length === 0 ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32 }]}>
            <Text style={styles.noRidesText}>You haven't booked any rides yet.</Text>
            <Text style={styles.noRidesSubtext}>When you book a ride, it will show up here.</Text>
          </View>
        ) : (
          rides.map((ride, index) => (
            <View key={ride.id || index} style={styles.rideCard}>
              <View style={styles.rideCardLeft}>
                <Text style={styles.rideLocations}>{ride.pickupLocation} to {ride.dropoffLocation}</Text>
                <Text style={styles.rideDetails}>
                  {new Date(ride.createdAt || Date.now()).toLocaleDateString()} • {ride.rideType}
                </Text>
              </View>
              <View style={[styles.rideCardRight, { alignItems: 'center', flexDirection: 'row', gap: 16 }]}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.ridePrice}>LKR {ride.fare ? ride.fare.toLocaleString() : '---'}</Text>
                  <View style={[
                    styles.statusBadge, 
                    ride.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      ride.status === 'COMPLETED' ? styles.statusTextCompleted : styles.statusTextPending
                    ]}>
                      {ride.status || 'PENDING'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteRide(ride.rideId || ride.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Payment History</Text>
        
        {loadingPayments ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
        ) : payments.length === 0 ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32 }]}>
            <Text style={styles.noRidesText}>No payments found.</Text>
          </View>
        ) : (
          payments.map((payment, index) => (
            <View key={payment.paymentId || index} style={styles.rideCard}>
              <View style={styles.rideCardLeft}>
                <Text style={styles.rideLocations}>Ride #{payment.ride?.rideId || 'N/A'}</Text>
                <Text style={styles.rideDetails}>
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Unknown Date'} • {payment.method}
                </Text>
              </View>
              <View style={[styles.rideCardRight, { alignItems: 'center', flexDirection: 'row', gap: 16 }]}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.ridePrice, { color: '#10b981' }]}>LKR {payment.amount ? payment.amount.toLocaleString() : '---'}</Text>
                  <View style={[styles.statusBadge, styles.statusCompleted]}>
                    <Text style={[styles.statusText, styles.statusTextCompleted]}>{payment.status}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeletePayment(payment.paymentId)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountText}>Delete My Account</Text>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  glassPanel: {
    backgroundColor: 'rgba(26, 29, 45, 0.7)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(15, 17, 26, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#ffffff',
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 17, 26, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#ffffff',
    padding: 12,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  noRidesText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '500',
  },
  noRidesSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  rideCard: {
    backgroundColor: 'rgba(26, 29, 45, 0.7)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rideCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  rideLocations: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  rideDetails: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rideCardRight: {
    alignItems: 'flex-end',
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusPending: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextCompleted: {
    color: '#10b981',
  },
  statusTextPending: {
    color: '#ef4444',
  },
  deleteAccountButton: { 
    marginTop: 32, 
    marginBottom: 40, 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(239,68,68,0.2)', 
    alignItems: 'center' 
  },
  deleteAccountText: { 
    color: '#ef4444', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
