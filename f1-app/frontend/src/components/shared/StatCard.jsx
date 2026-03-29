import React from 'react';

function StatCard({ label, value, sub, color, size = 'md' }) {
  const sizeClasses = {
    sm: 'font-size: 18px',
    md: 'font-size: 24px',
    lg: 'font-size: 32px'
  };

  return (
    <div className="panel" style={{ padding: '12px', textAlign: 'center' }}>
      <div style={{ 
        fontFamily: 'Orbitron', 
        fontSize: '8px', 
        color: 'var(--muted)', 
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '4px'
      }}>
        {label}
      </div>
      <div style={{ 
        fontFamily: 'Orbitron', 
        fontSize: sizeClasses[size],
        color: color || 'var(--text)',
        fontWeight: 700
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ 
          fontSize: '10px', 
          color: 'var(--muted2)',
          marginTop: '2px'
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default StatCard;
