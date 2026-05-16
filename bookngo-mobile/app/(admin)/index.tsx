import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../api/axios';

export default function AdminOverviewScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ridesRes] = await Promise.all([
          api.get('/users'),
          api.get('/rides')
        ]);
        setUsers(usersRes.data);
        setRides(ridesRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDrivers = users.filter(u => u.role === 'DRIVER').length;
  const ridesToday = rides.length;
  const pendingRides = rides.filter(r => r.status === 'PENDING').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Command Center</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderLeftColor: '#6366f1' }]}>
                <Text style={styles.statLabel}>Total Users</Text>
                <Text style={styles.statValue}>{users.length}</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                <Text style={styles.statLabel}>Total Drivers</Text>
                <Text style={styles.statValue}>{totalDrivers}</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#ec4899' }]}>
                <Text style={styles.statLabel}>Total Rides</Text>
                <Text style={styles.statValue}>{ridesToday}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={styles.glassPanel}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Database Connection</Text>
                <Text style={[styles.statusValue, { color: '#10b981' }]}>Healthy</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>API Server</Text>
                <Text style={[styles.statusValue, { color: '#10b981' }]}>Online</Text>
              </View>
              <View style={[styles.statusRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.statusLabel}>Live Requests</Text>
                <Text style={[styles.statusValue, { color: '#fbbf24' }]}>{pendingRides} Pending</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 24, marginTop: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderLeftWidth: 4 },
  statLabel: { color: '#9ca3af', fontSize: 14, marginBottom: 8 },
  statValue: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 16 },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  statusLabel: { color: '#9ca3af', fontSize: 16 },
  statusValue: { fontSize: 16, fontWeight: 'bold' },
});
