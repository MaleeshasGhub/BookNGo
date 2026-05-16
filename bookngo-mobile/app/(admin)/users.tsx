import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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
    } catch (err) {
      Alert.alert('Error', 'Failed to approve user');
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

              {u.status === 'INACTIVE' && (
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(u.userId)}>
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              )}
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
  approveButton: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 12 },
  approveButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});
