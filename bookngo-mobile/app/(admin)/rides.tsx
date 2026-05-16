import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../api/axios';

export default function AdminRidesScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get('/rides');
        setRides(res.data);
      } catch (err) {
        console.error('Failed to fetch rides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Live Rides</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 40 }} />
        ) : rides.length === 0 ? (
          <Text style={styles.emptyText}>No rides found.</Text>
        ) : (
          rides.map((r) => (
            <View key={r.rideId} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideId}>Ride #{r.rideId}</Text>
                <View style={[
                  styles.statusBadge, 
                  r.status === 'COMPLETED' ? styles.statusCompleted : r.status === 'PENDING' ? styles.statusPending : styles.statusAccepted
                ]}>
                  <Text style={[
                    styles.statusText,
                    r.status === 'COMPLETED' ? styles.statusTextCompleted : r.status === 'PENDING' ? styles.statusTextPending : styles.statusTextAccepted
                  ]}>{r.status}</Text>
                </View>
              </View>
              <Text style={styles.ridePassenger}>{r.passenger?.fullName || 'Unknown Passenger'}</Text>
              <Text style={styles.rideRoute}><Text style={styles.bold}>From:</Text> {r.pickupLocation}</Text>
              <Text style={styles.rideRoute}><Text style={styles.bold}>To:</Text> {r.dropoffLocation}</Text>
              <View style={styles.rideFooter}>
                <Text style={styles.rideType}>{r.rideType}</Text>
                {r.driver && <Text style={styles.driverText}>Driver: {r.driver.fullName}</Text>}
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
  rideCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rideId: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusCompleted: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  statusPending: { backgroundColor: 'rgba(251, 191, 36, 0.2)' },
  statusAccepted: { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextCompleted: { color: '#10b981' },
  statusTextPending: { color: '#fbbf24' },
  statusTextAccepted: { color: '#6366f1' },
  ridePassenger: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  rideRoute: { color: '#d1d5db', fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#9ca3af' },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  rideType: { color: '#6366f1', fontWeight: 'bold' },
  driverText: { color: '#10b981', fontSize: 12 },
});
