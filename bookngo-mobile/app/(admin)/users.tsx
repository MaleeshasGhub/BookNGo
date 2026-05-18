import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import api from '../../api/axios';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/approve`);
      fetchUsers();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to approve user');
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/deactivate`);
      fetchUsers();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to deactivate user');
    }
  };

  const executeDelete = async (id: number, role: string) => {
    try {
      if (role === 'DRIVER') {
        await api.delete(`/admin/drivers/${id}`);
      } else {
        await api.delete(`/admin/users/${id}`);
      }
      fetchUsers();
    } catch (err: any) {
      console.error("Delete Error:", err.response || err);
      if (Platform.OS === 'web') {
        window.alert(err.response?.data?.error || err.message || 'Failed to delete user');
      } else {
        Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to delete user');
      }
    }
  };

  const handleDelete = (id: number, role: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to permanently delete this user?');
      if (confirmed) {
        executeDelete(id, role);
      }
    } else {
      Alert.alert('Confirm', 'Are you sure you want to permanently delete this user?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => executeDelete(id, role)
        }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Manage Users</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 40 }} />
        ) : users.length === 0 ? (
          <Text style={styles.emptyText}>No users found.</Text>
        ) : (
          users.map((u) => (
            <View key={u.userId} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.fullName}</Text>
                <Text style={styles.userEmail}>{u.email}</Text>
                <Text style={styles.userId}>ID: #{u.userId}</Text>
              </View>
              <View style={[
                styles.roleBadge, 
                u.userType === 'ADMIN' ? styles.roleAdmin : u.userType === 'DRIVER' ? styles.roleDriver : styles.rolePassenger
              ]}>
                <Text style={[
                  styles.roleText,
                  u.userType === 'ADMIN' ? styles.roleTextAdmin : u.userType === 'DRIVER' ? styles.roleTextDriver : styles.roleTextPassenger
                ]}>{u.userType}</Text>
              </View>

              <View style={styles.actionContainer}>
                {u.status === 'INACTIVE' ? (
                  <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(u.userId)}>
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.deactivateButton} onPress={() => handleDeactivate(u.userId)}>
                    <Text style={styles.deactivateButtonText}>Deactivate</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(u.userId, u.userType)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 24, marginTop: 20 },
  emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  userCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  userInfo: { flex: 1 },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { color: '#9ca3af', fontSize: 14, marginBottom: 4 },
  userId: { color: '#6b7280', fontSize: 12 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  roleAdmin: { backgroundColor: 'rgba(236, 72, 153, 0.2)' },
  roleDriver: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  rolePassenger: { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  roleTextAdmin: { color: '#ec4899' },
  roleTextDriver: { color: '#10b981' },
  roleTextPassenger: { color: '#6366f1' },
  actionContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  approveButton: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  approveButtonText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  deactivateButton: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  deactivateButtonText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  deleteButton: { backgroundColor: 'transparent', borderColor: 'rgba(239, 68, 68, 0.5)', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  deleteButtonText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
});
