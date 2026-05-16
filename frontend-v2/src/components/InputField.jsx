import React, { useState } from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
      {label && (
        <label style={{ 
          fontSize: '0.9rem', 
          fontWeight: '500', 
          color: isFocused ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'var(--transition-fast)'
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(26, 29, 45, 0.4)',
          border: `1px solid ${error ? 'var(--danger)' : isFocused ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
          color: 'var(--text-main)',
          fontSize: '1rem',
          outline: 'none',
          transition: 'var(--transition-fast)',
          boxShadow: isFocused && !error ? '0 0 0 3px rgba(99, 102, 241, 0.2)' : 'none'
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};

export default InputField;
