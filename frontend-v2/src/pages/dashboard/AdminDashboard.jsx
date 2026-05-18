import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [editingAdminId, setEditingAdminId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, ridesRes, adminsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/rides'),
        api.get('/admin')
      ]);
      setUsers(usersRes.data);
      setRides(ridesRes.data);
      setAdmins(adminsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      // Fallback if /admin/... endpoints are not reachable by current role etc.
      try {
        const fallbackUsers = await api.get('/users');
        const fallbackRides = await api.get('/rides');
        setUsers(fallbackUsers.data);
        setRides(fallbackRides.data);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      if (editingAdminId) {
        await api.put(`/admin/${editingAdminId}`, newAdmin);
      } else {
        await api.post('/admin/register', newAdmin);
      }
      closeAdminModal();
      fetchData();
    } catch (err) {
      console.error('Failed to save admin', err);
    }
  };

  const openEditAdminModal = (admin) => {
    setNewAdmin({ fullName: admin.fullName, email: admin.email, password: '', phone: admin.phone });
    setEditingAdminId(admin.adminId || admin.userId);
    setShowAdminModal(true);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingAdminId(null);
    setNewAdmin({ fullName: '', email: '', password: '', phone: '' });
  };

  const handleDeleteAdmin = async (id) => {
    if(!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await api.delete(`/admin/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete admin', err);
    }
  };

  const handleActivateUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/approve`);
      fetchData();
    } catch (err) {
      console.error('Failed to activate user', err);
    }
  };

  const handleDeactivateUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/deactivate`);
      fetchData();
    } catch (err) {
      console.error('Failed to deactivate user', err);
    }
  };

  const handleDeleteUser = async (id, role) => {
    if(!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      if (role === 'DRIVER') {
        await api.delete(`/admin/drivers/${id}`);
      } else {
        await api.delete(`/admin/users/${id}`);
      }
      fetchData();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const totalDrivers = users.filter(u => u.role === 'DRIVER').length;
  const ridesToday = rides.length;

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading Admin Data...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Admin Command Center</h2>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: 'var(--border-subtle)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'users' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('rides')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'rides' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'rides' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Live Rides
        </button>
        <button 
          onClick={() => setActiveTab('admins')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'admins' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.2rem', fontWeight: activeTab === 'admins' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Manage Admins
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Users</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{users.length}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Drivers</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{totalDrivers}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Rides</p>
              <h3 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{ridesToday}</h3>
            </div>
          </div>

          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>System Status</h3>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: 'var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Connection</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Healthy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: 'var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>API Server</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Live Requests</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{rides.filter(r => r.status === 'PENDING').length} Pending</span>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{u.userId}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.fullName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: u.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.2)' : u.role === 'DRIVER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: u.role === 'ADMIN' ? 'var(--secondary)' : u.role === 'DRIVER' ? 'var(--accent)' : 'var(--primary)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: u.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: u.status === 'ACTIVE' ? 'var(--accent)' : 'var(--danger)'
                    }}>
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {u.status === 'ACTIVE' || !u.status ? (
                      <button onClick={() => handleDeactivateUser(u.userId)} style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                        Deactivate
                      </button>
                    ) : (
                      <button onClick={() => handleActivateUser(u.userId)} style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                        Activate
                      </button>
                    )}
                    <button onClick={() => handleDeleteUser(u.userId, u.role)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rides' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Ride ID</th>
                <th style={{ padding: '1rem' }}>Passenger</th>
                <th style={{ padding: '1rem' }}>Route</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map(r => (
                <tr key={r.rideId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{r.rideId}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.passenger?.fullName || 'Unknown'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <div>From: {r.pickupLocation}</div>
                    <div>To: {r.dropoffLocation}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{r.rideType}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: r.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : r.status === 'PENDING' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: r.status === 'COMPLETED' ? 'var(--accent)' : r.status === 'PENDING' ? '#fbbf24' : 'var(--primary)'
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Admin Users</h3>
            <button 
              onClick={() => setShowAdminModal(true)}
              style={{ 
                background: 'var(--primary)', color: '#fff', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              + Add Admin
            </button>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.adminId || a.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{a.adminId || a.userId}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{a.fullName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{a.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{a.phone}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditAdminModal(a)} style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAdmin(a.adminId || a.userId)} style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No admin users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdminModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', 
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{editingAdminId ? 'Edit Admin' : 'Add New Admin'}</h3>
            <form onSubmit={handleCreateOrUpdateAdmin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" required
                  value={newAdmin.fullName}
                  onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                <input 
                  type="email" required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Password {editingAdminId && <span style={{fontSize: '0.8rem'}}>(Leave blank to keep current)</span>}
                </label>
                <input 
                  type="password" required={!editingAdminId}
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone</label>
                <input 
                  type="text" required
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={closeAdminModal} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>{editingAdminId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
