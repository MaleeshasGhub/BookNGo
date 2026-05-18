import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native';
import api from '../../api/axios';

export default function AdminAdminsScreen() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin');
      setAdmins(res.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSave = async () => {
    try {
      if (isEditing && editingId) {
        await api.put(`/admin/${editingId}`, formData);
        if (Platform.OS === 'web') window.alert('Admin updated successfully');
        else Alert.alert('Success', 'Admin updated successfully');
      } else {
        await api.post('/admin/register', formData);
        if (Platform.OS === 'web') window.alert('Admin created successfully');
        else Alert.alert('Success', 'Admin created successfully');
      }
      setModalVisible(false);
      fetchAdmins();
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert(err.response?.data?.error || 'Failed to save admin');
      else Alert.alert('Error', err.response?.data?.error || 'Failed to save admin');
    }
  };

  const executeDeleteAdmin = async (id: number) => {
    try {
      await api.delete(`/admin/${id}`);
      fetchAdmins();
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert('Failed to delete admin');
      else Alert.alert('Error', 'Failed to delete admin');
    }
  };

  const handleDelete = async (id: number) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this admin?');
      if (confirmed) {
        executeDeleteAdmin(id);
      }
    } else {
      Alert.alert('Confirm', 'Are you sure you want to delete this admin?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => executeDeleteAdmin(id)
        }
      ]);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ fullName: '', email: '', password: '', phone: '' });
    setModalVisible(true);
  };

  const openEditModal = (admin: any) => {
    setIsEditing(true);
    setEditingId(admin.adminId || admin.userId);
    setFormData({ fullName: admin.fullName, email: admin.email, password: '', phone: admin.phone });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Admins</Text>
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 40 }} />
        ) : admins.length === 0 ? (
          <Text style={styles.emptyText}>No admins found.</Text>
        ) : (
          admins.map((a) => (
            <View key={a.adminId || a.userId} style={styles.adminCard}>
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{a.fullName}</Text>
                <Text style={styles.adminEmail}>{a.email}</Text>
                <Text style={styles.adminPhone}>{a.phone}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(a)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(a.adminId || a.userId)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Admin' : 'New Admin'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder={isEditing ? "Password (leave blank to keep)" : "Password"}
              placeholderTextColor="#6b7280"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  addButton: { backgroundColor: '#ec4899', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#ffffff', fontWeight: 'bold' },
  emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  adminCard: { backgroundColor: 'rgba(26, 29, 45, 0.7)', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  adminInfo: { marginBottom: 12 },
  adminName: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  adminEmail: { color: '#9ca3af', fontSize: 14, marginBottom: 2 },
  adminPhone: { color: '#6b7280', fontSize: 12 },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12 },
  editButton: { backgroundColor: 'rgba(99, 102, 241, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  editButtonText: { color: '#6366f1', fontWeight: 'bold' },
  deleteButton: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  deleteButtonText: { color: '#ef4444', fontWeight: 'bold' },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1a1d2d', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center' },
  cancelButtonText: { color: '#ffffff', fontWeight: 'bold' },
  saveButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#ec4899', alignItems: 'center' },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold' },
});
