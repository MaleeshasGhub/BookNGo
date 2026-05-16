import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaymentScreen() {
  const { amount = '7,200', rideType = 'Premium', rideId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      if (Platform.OS === 'web') {
        window.alert('Payment Successful! Thank you for riding with BookNGo!');
        router.replace({ pathname: '/review', params: { rideId: rideId || '1' } });
      } else {
        Alert.alert('Payment Successful', 'Thank you for riding with BookNGo!', [
          { text: 'OK', onPress: () => router.replace({ pathname: '/review', params: { rideId: rideId || '1' } }) }
        ]);
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ride Completed</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.glassPanel}>
          <Text style={styles.sectionTitle}>Receipt Breakdown</Text>
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Base Fare</Text>
            <Text style={styles.receiptValue}>LKR 1,500</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Distance (4.2 miles)</Text>
            <Text style={styles.receiptValue}>LKR 3,750</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Time (14 mins)</Text>
            <Text style={styles.receiptValue}>LKR 1,200</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: '#9ca3af' }]}>Taxes & Fees</Text>
            <Text style={[styles.receiptValue, { color: '#9ca3af' }]}>LKR 750</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>LKR {amount}</Text>
          </View>
        </View>

        <Text style={[styles.title, { marginTop: 16 }]}>Payment Method</Text>
        <View style={styles.glassPanel}>
          <View style={styles.methodToggleContainer}>
            <TouchableOpacity 
              style={[styles.methodToggle, method === 'card' && styles.methodToggleActive]}
              onPress={() => setMethod('card')}
            >
              <Text style={[styles.methodToggleText, method === 'card' && styles.methodToggleTextActive]}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.methodToggle, method === 'paypal' && styles.methodToggleActive]}
              onPress={() => setMethod('paypal')}
            >
              <Text style={[styles.methodToggleText, method === 'paypal' && styles.methodToggleTextActive]}>PayPal</Text>
            </TouchableOpacity>
          </View>

          {method === 'card' && (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cardholder Name</Text>
                <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#6b7280" />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput style={styles.input} placeholder="**** **** **** 4242" placeholderTextColor="#6b7280" keyboardType="numeric" />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput style={styles.input} placeholder="MM/YY" placeholderTextColor="#6b7280" />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>CVC</Text>
                  <TextInput style={styles.input} placeholder="123" placeholderTextColor="#6b7280" keyboardType="numeric" secureTextEntry />
                </View>
              </View>
            </View>
          )}

          {method === 'paypal' && (
            <View style={styles.paypalContainer}>
              <Text style={styles.paypalText}>You will be redirected to PayPal to complete your purchase securely.</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.payButton, loading && styles.payButtonDisabled]} 
            onPress={handlePayment} 
            disabled={loading}
          >
            <Text style={styles.payButtonText}>{loading ? 'Processing...' : `Pay LKR ${amount}`}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f111a' },
  content: { padding: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  backButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, width: 70, alignItems: 'center' },
  backButtonText: { color: '#ffffff', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
  glassPanel: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 24 },
  sectionTitle: { fontSize: 18, color: '#9ca3af', marginBottom: 12 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 16 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  receiptLabel: { color: '#ffffff', fontSize: 16 },
  receiptValue: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  totalLabel: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  totalValue: { color: '#10b981', fontSize: 20, fontWeight: 'bold' },
  methodToggleContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  methodToggle: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  methodToggleActive: { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  methodToggleText: { color: '#9ca3af', fontWeight: 'bold' },
  methodToggleTextActive: { color: '#10b981' },
  formContainer: { gap: 16 },
  inputContainer: { marginBottom: 16 },
  label: { color: '#d1d5db', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'rgba(15, 17, 26, 0.5)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, color: '#ffffff', padding: 16, fontSize: 16 },
  row: { flexDirection: 'row' },
  paypalContainer: { padding: 20, alignItems: 'center', backgroundColor: 'rgba(15, 17, 26, 0.5)', borderRadius: 8, marginBottom: 16 },
  paypalText: { color: '#9ca3af', textAlign: 'center' },
  payButton: { backgroundColor: '#10b981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});
