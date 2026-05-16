import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import api from '../../api/axios';

export default function AdminReviewsScreen() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: number, isHidden: boolean) => {
    try {
      if (isHidden) {
        await api.put(`/reviews/${id}/show`);
      } else {
        await api.put(`/reviews/${id}/hide`);
      }
      fetchReviews();
    } catch (err) {
      Alert.alert('Error', 'Failed to update review visibility');
    }
  };

  const deleteReview = async (id: number) => {
    const confirmDelete = () => {
      api.delete(`/reviews/${id}`).then(() => fetchReviews()).catch(() => Alert.alert('Error', 'Failed to delete review'));
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this review permanently?')) {
        confirmDelete();
      }
    } else {
      Alert.alert('Delete Review', 'Are you sure you want to delete this review permanently?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Review Moderation</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
        ) : reviews.length === 0 ? (
          <View style={[styles.glassPanel, { alignItems: 'center', padding: 32 }]}>
            <Text style={styles.noDataText}>No reviews found.</Text>
          </View>
        ) : (
          reviews.map((rev) => (
            <View key={rev.reviewId} style={[styles.reviewCard, rev.isHidden && styles.reviewCardHidden]}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewPassenger}>By: {rev.passenger?.fullName || 'Unknown'}</Text>
                  <Text style={styles.reviewDriver}>To: {rev.driver?.fullName || 'Unknown'}</Text>
                </View>
                <Text style={styles.reviewStars}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.dateText}>{new Date(rev.createdAt).toLocaleDateString()}</Text>
                {rev.verified && <Text style={styles.verifiedText}>✓ Verified</Text>}
                {rev.isHidden && <Text style={styles.hiddenText}>HIDDEN</Text>}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, rev.isHidden ? styles.showButton : styles.hideButton]}
                  onPress={() => toggleVisibility(rev.reviewId, rev.isHidden)}
                >
                  <Text style={styles.actionButtonText}>{rev.isHidden ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteReview(rev.reviewId)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
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
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 24, marginTop: 16 },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  noDataText: { color: '#9ca3af', fontSize: 16 },
  reviewCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  reviewCardHidden: { opacity: 0.6, borderColor: 'rgba(239, 68, 68, 0.3)' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  reviewPassenger: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  reviewDriver: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  reviewStars: { color: '#fbbf24', letterSpacing: 2, fontSize: 16 },
  reviewComment: { color: '#d1d5db', fontStyle: 'italic', marginBottom: 16, fontSize: 15 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', paddingTop: 12 },
  dateText: { color: '#6b7280', fontSize: 12 },
  verifiedText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  hiddenText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  hideButton: { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1, borderColor: '#f59e0b' },
  showButton: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1, borderColor: '#10b981' },
  deleteButton: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: '#ef4444' },
  actionButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 }
});
