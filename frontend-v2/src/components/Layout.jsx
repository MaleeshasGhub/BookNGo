import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const publicLinks = [
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const getPrivateLinks = () => {
    if (!user) return [];
    if (user.userType === 'DRIVER') return [{ name: 'Dashboard', path: '/driver' }];
    if (user.userType === 'ADMIN') return [{ name: 'Admin', path: '/admin' }];
    return [
      { name: 'Book Ride', path: '/book' },
      { name: 'Profile', path: '/profile' }
    ];
  };

  const navLinks = user ? getPrivateLinks() : publicLinks;

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav className="glass-panel" style={{
        position: 'sticky',
        top: '1rem',
        margin: '0 1rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderRadius: 'var(--radius-pill)'
      }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-1px' }}>
          <span style={{ color: 'var(--text-main)' }}>Book</span>
          <span style={{ color: 'var(--primary)' }}>NGo</span>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: '500',
                transition: 'var(--transition-fast)',
                borderBottom: location.pathname === link.path ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px'
              }}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <button 
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: '3rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
      {/* Custom Logout Confirmation Modal */}
      <ConfirmModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={confirmLogout} 
        title="Confirm Logout" 
        message="Are you sure you want to securely log out of your session?" 
      />
    </div>
  );
};

export default Layout;
