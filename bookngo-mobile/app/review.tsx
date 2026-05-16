import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewScreen() {
  const { user } = useAuth();
  const { rideId } = useLocalSearchParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        rideId: rideId || '1', // fallback if missing
        passengerId: user?.userId,
        rating: rating.toString(),
        comment: comment || 'Great ride!'
      });

      if (Platform.OS === 'web') {
        window.alert('Review submitted successfully! Thank you.');
        router.replace('/(dashboard)');
      } else {
        Alert.alert('Success', 'Review submitted successfully!', [
          { text: 'OK', onPress: () => router.replace('/(dashboard)') }
        ]);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to submit review';
      if (Platform.OS === 'web') {
        window.alert('Error: ' + msg);
        router.replace('/(dashboard)');
      } else {
        Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg), [
          { text: 'OK', onPress: () => router.replace('/(dashboard)') }
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(dashboard)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How was your ride?</Text>
        <Text style={styles.subtitle}>Your feedback helps us improve the BookNGo experience.</Text>

        <View style={styles.glassPanel}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={48} 
                  color={star <= rating ? "#fbbf24" : "#9ca3af"} 
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>{rating} out of 5</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Leave a comment (optional)..."
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={submitting}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#9ca3af', marginBottom: 32, textAlign: 'center' },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 24 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  ratingText: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  textInput: { backgroundColor: 'rgba(15, 17, 26, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, color: '#ffffff', padding: 16, fontSize: 16, height: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  submitButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  skipButton: { padding: 16, alignItems: 'center' },
  skipButtonText: { color: '#9ca3af', fontSize: 16, fontWeight: '600' }
});
