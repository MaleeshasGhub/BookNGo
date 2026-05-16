import React from 'react';
import PremiumButton from './PremiumButton';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'rgba(15, 17, 26, 0.8)', backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>
      <div className="glass-panel" style={{
        padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center',
        animation: 'slideUp 0.3s ease-out', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <PremiumButton variant="secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </PremiumButton>
          <PremiumButton variant="danger" style={{ flex: 1 }} onClick={onConfirm}>
            Yes, proceed
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
