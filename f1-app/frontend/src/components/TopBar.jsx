import React from 'react';

function TopBar() {
  return (
    <header style={{
      height: '50px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(9,9,12,0.96)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: 'var(--red)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }} />
        <div>
          <div style={{ 
            fontFamily: 'Orbitron', 
            fontWeight: 900, 
            fontSize: '16px',
            letterSpacing: '2px'
          }}>
            PITWALL
          </div>
          <div style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '8px', 
            color: 'var(--red)',
            letterSpacing: '1px'
          }}>
            PERFORMANCE TRACKER
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: 'Orbitron',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '2px',
        color: 'var(--text)'
      }}>
        F1 ANALYTICS DASHBOARD 2024
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 8px var(--green)',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{
          fontFamily: 'Orbitron',
          fontSize: '9px',
          letterSpacing: '1.5px',
          color: 'var(--green)'
        }}>
          LIVE DATA
        </span>
      </div>
    </header>
  );
}

export default TopBar;
