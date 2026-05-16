import React from 'react';

const PremiumButton = ({ children, variant = 'primary', className = '', style = {}, ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'white',
      boxShadow: 'var(--shadow-glow)',
    },
    secondary: {
      background: 'var(--bg-panel-light)',
      color: 'var(--text-main)',
      border: 'var(--border-subtle)',
    },
    danger: {
      background: 'var(--danger)',
      color: 'white',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant], ...style }}
      className={`premium-btn ${className}`}
      onMouseOver={(e) => {
        if(variant === 'primary') {
          e.currentTarget.style.background = 'var(--primary-hover)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        } else {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') {
          e.currentTarget.style.background = 'var(--primary)';
        }
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default PremiumButton;
