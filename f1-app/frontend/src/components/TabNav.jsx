import React from 'react';

const tabs = [
  { id: 'career', label: 'Career Arc' },
  { id: 'constructor', label: 'Constructor' },
  { id: 'track', label: 'Track DNA' },
  { id: 'sim', label: 'Sim Benchmarker' },
  { id: 'predictions', label: '🏆 PREDICTIONS' },
  { id: 'sentiment', label: '📊 SENTIMENT' },
  { id: 'fantasy', label: '💰 FANTASY' },
  { id: 'radio', label: '🎙 RADIO' },
  { id: 'pitstop', label: '⏱ PIT STOP' }
];

function TabNav({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      height: '42px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--panel)',
      display: 'flex',
      alignItems: 'stretch',
      flexShrink: 0,
      overflowX: 'auto',
      overflowY: 'hidden'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: '0 0 auto',
            padding: '0 16px',
            minWidth: '110px',
            background: activeTab === tab.id ? 'rgba(232,0,45,0.06)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid var(--red)' : '2px solid transparent',
            color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)',
            fontFamily: 'Orbitron',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default TabNav;
