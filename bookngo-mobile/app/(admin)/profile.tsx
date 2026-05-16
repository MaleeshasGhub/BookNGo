import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();

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
      <View style={styles.content}>
        <Text style={styles.title}>Admin Profile</Text>

        <View style={styles.glassPanel}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'A'}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || 'Admin User'}</Text>
          <Text style={styles.email}>{user?.email || 'admin@bookngo.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>ADMINISTRATOR</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 32, textAlign: 'center' },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 32 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(236, 72, 153, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#ec4899' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#ec4899' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  email: { fontSize: 16, color: '#9ca3af', marginBottom: 16 },
  roleBadge: { backgroundColor: 'rgba(236, 72, 153, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  roleText: { color: '#ec4899', fontWeight: 'bold', fontSize: 12 },
  logoutButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center' },
  logoutButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
