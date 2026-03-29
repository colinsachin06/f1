import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const categoryColors = {
  strategy: '#0067FF',
  incident: '#E8002D',
  emotion: '#FFD700',
  technical: '#00CFFF',
  funny: '#39FF14'
};

const categoryLabels = {
  strategy: 'STRATEGY CALL',
  incident: 'INCIDENT',
  emotion: 'CELEBRATION',
  technical: 'TECHNICAL',
  funny: 'CLASSIC MOMENT'
};

function RadioReplay() {
  const [races, setRaces] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedRace, setSelectedRace] = useState('bahrain2024');
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const driverCodes = ['VER', 'NOR', 'HAM', 'LEC', 'RUS', 'PIA', 'ALO', 'SAI'];
  const categories = ['all', 'strategy', 'incident', 'emotion', 'technical', 'funny'];

  useEffect(() => {
    axios.get('/api/radio/races').then(res => setRaces(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('race', selectedRace);
        if (selectedDrivers.length > 0) params.set('drivers', selectedDrivers.join(','));
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        const res = await axios.get(`/api/radio?${params.toString()}`);
        setEntries(res.data);
        if (res.data.length > 0 && !selectedEntry) {
          setSelectedEntry(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load radio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [selectedRace, selectedDrivers, selectedCategory]);

  const toggleDriver = (code) => {
    setSelectedDrivers(prev =>
      prev.includes(code) ? prev.filter(d => d !== code) : [...prev, code]
    );
  };

  const handleShare = () => {
    if (!selectedEntry) return;
    const text = `${selectedEntry.driverCode} @ ${races.find(r => r.id === selectedEntry.race)?.name || selectedEntry.race} Lap ${selectedEntry.lap}: "${selectedEntry.transcript}" #F1 #PitWall`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const relatedEntries = selectedEntry
    ? entries.filter(e => e.id !== selectedEntry.id && e.race === selectedEntry.race).slice(0, 3)
    : [];

  // Calculate race position for timeline bar (assuming ~55 laps avg)
  const maxLap = entries.length > 0 ? Math.max(...entries.map(e => e.lap), 55) : 55;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '16px',
      height: '100%',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* LEFT — RADIO ARCHIVE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
        <div className="section-header">Radio Archive</div>

        {/* Race Selector */}
        <select
          value={selectedRace}
          onChange={e => { setSelectedRace(e.target.value); setSelectedEntry(null); }}
          style={{ width: '100%', flexShrink: 0 }}
        >
          {races.map(r => (
            <option key={r.id} value={r.id}>{r.name} {r.year}</option>
          ))}
        </select>

        {/* Driver Filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flexShrink: 0 }}>
          {driverCodes.map(code => {
            const isActive = selectedDrivers.includes(code);
            const teamColors = {
              VER: '#3671C6', NOR: '#FF8000', HAM: '#27F4D2', LEC: '#E8002D',
              RUS: '#27F4D2', PIA: '#FF8000', ALO: '#229971', SAI: '#0093CC'
            };
            return (
              <button
                key={code}
                onClick={() => toggleDriver(code)}
                style={{
                  padding: '3px 8px',
                  background: isActive ? teamColors[code] + '25' : 'var(--panel2)',
                  border: isActive ? `1px solid ${teamColors[code]}` : '1px solid var(--border)',
                  color: isActive ? '#fff' : 'var(--muted)',
                  fontFamily: 'Orbitron',
                  fontSize: '8px',
                  fontWeight: 700,
                  borderRadius: '12px'
                }}
              >
                {code}
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flexShrink: 0 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '3px 8px',
                background: selectedCategory === cat ? (cat === 'all' ? 'var(--red)' : categoryColors[cat] + '30') : 'var(--panel2)',
                border: selectedCategory === cat ? `1px solid ${cat === 'all' ? 'var(--red)' : categoryColors[cat]}` : '1px solid var(--border)',
                color: selectedCategory === cat ? '#fff' : 'var(--muted)',
                fontFamily: 'Orbitron',
                fontSize: '7px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div className="skeleton" style={{ height: '400px' }} />
          ) : entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontFamily: 'Orbitron', fontSize: '10px' }}>
              NO RADIO ENTRIES FOUND
            </div>
          ) : (
            entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  padding: '10px',
                  borderLeft: `3px solid ${entry.teamColor}`,
                  background: selectedEntry?.id === entry.id ? 'rgba(232,0,45,0.06)' : 'transparent',
                  cursor: 'pointer',
                  borderRadius: '0 4px 4px 0',
                  marginBottom: '4px',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'Orbitron',
                    fontSize: '8px',
                    fontWeight: 700,
                    background: 'var(--panel2)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    color: 'var(--yellow)'
                  }}>
                    LAP {entry.lap}
                  </span>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: entry.teamColor
                  }} />
                  <span style={{ fontFamily: 'Orbitron', fontSize: '10px', fontWeight: 700 }}>
                    {entry.driverCode}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    padding: '1px 6px',
                    background: (categoryColors[entry.category] || '#fff') + '20',
                    color: categoryColors[entry.category] || '#fff',
                    fontFamily: 'Orbitron',
                    fontSize: '6px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {entry.category}
                  </span>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--muted2)', marginBottom: '2px' }}>
                  {entry.direction} • {entry.timestamp}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text)',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {entry.transcript.substring(0, 60)}...
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT — RADIO PLAYER */}
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!selectedEntry ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            fontFamily: 'Orbitron',
            fontSize: '12px'
          }}>
            SELECT A RADIO MESSAGE TO VIEW
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEntry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Header Card */}
              <div className="panel" style={{
                padding: '16px',
                borderTop: `3px solid ${selectedEntry.teamColor}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                      {selectedEntry.driverCode}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {races.find(r => r.id === selectedEntry.race)?.name || selectedEntry.race} • Lap {selectedEntry.lap} • {selectedEntry.timestamp}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    background: 'var(--panel2)',
                    border: '1px solid var(--border)',
                    fontFamily: 'Orbitron',
                    fontSize: '8px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    color: 'var(--muted2)',
                    letterSpacing: '0.5px'
                  }}>
                    {selectedEntry.direction}
                  </span>
                </div>
              </div>

              {/* Transcript Display */}
              <div className="panel" style={{ padding: '24px', position: 'relative' }}>
                <span style={{
                  fontFamily: 'Orbitron',
                  fontSize: '64px',
                  fontWeight: 700,
                  color: selectedEntry.teamColor,
                  opacity: 0.15,
                  position: 'absolute',
                  top: '8px',
                  left: '16px',
                  lineHeight: 1
                }}>
                  "
                </span>
                <div style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.8,
                  color: 'var(--text)',
                  paddingLeft: '12px',
                  paddingTop: '20px',
                  fontStyle: 'italic'
                }}>
                  "{selectedEntry.transcript}"
                </div>
                <div style={{
                  marginTop: '16px',
                  paddingLeft: '12px',
                  fontSize: '12px',
                  color: 'var(--muted)'
                }}>
                  — {selectedEntry.driverCode}, {races.find(r => r.id === selectedEntry.race)?.name || ''}, Lap {selectedEntry.lap}
                </div>
              </div>

              {/* Context Card */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header" style={{ marginBottom: '8px' }}>What Happened</div>
                <div style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '10px' }}>
                  {selectedEntry.context}
                </div>
                <span style={{
                  padding: '3px 10px',
                  background: (categoryColors[selectedEntry.category] || '#fff') + '20',
                  color: categoryColors[selectedEntry.category] || '#fff',
                  fontFamily: 'Orbitron',
                  fontSize: '8px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  {categoryLabels[selectedEntry.category] || selectedEntry.category.toUpperCase()}
                </span>
              </div>

              {/* Race Moment Visualizer */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header" style={{ marginBottom: '12px' }}>Race Timeline</div>
                <div style={{ position: 'relative', height: '40px' }}>
                  {/* Track bar */}
                  <div style={{
                    position: 'absolute',
                    top: '18px',
                    left: '0',
                    right: '0',
                    height: '6px',
                    background: 'var(--border)',
                    borderRadius: '3px'
                  }} />
                  {/* Position marker */}
                  <motion.div
                    initial={{ left: 0, opacity: 0 }}
                    animate={{ left: `${(selectedEntry.lap / maxLap) * 100}%`, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      width: '12px',
                      height: '12px',
                      background: selectedEntry.teamColor,
                      borderRadius: '50%',
                      transform: 'translateX(-6px)',
                      boxShadow: `0 0 12px ${selectedEntry.teamColor}60`,
                      zIndex: 2
                    }}
                  />
                  {/* Lap label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '0px',
                      left: `${(selectedEntry.lap / maxLap) * 100}%`,
                      transform: 'translateX(-50%)',
                      fontFamily: 'Orbitron',
                      fontSize: '8px',
                      color: selectedEntry.teamColor,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    LAP {selectedEntry.lap}
                  </motion.div>
                  {/* Labels */}
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '8px',
                    color: 'var(--muted)',
                    fontFamily: 'Orbitron'
                  }}>
                    <span>START</span>
                    <span>MIDPOINT</span>
                    <span>END</span>
                  </div>
                </div>
              </div>

              {/* Related Radios */}
              {relatedEntries.length > 0 && (
                <div className="panel" style={{ padding: '14px' }}>
                  <div className="section-header" style={{ marginBottom: '8px' }}>More From This Race</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {relatedEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          padding: '8px',
                          background: 'var(--panel2)',
                          borderLeft: `3px solid ${entry.teamColor}`,
                          borderRadius: '0 4px 4px 0',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: entry.teamColor }} />
                          <span style={{ fontFamily: 'Orbitron', fontSize: '9px', fontWeight: 700 }}>{entry.driverCode}</span>
                          <span style={{ fontFamily: 'Orbitron', fontSize: '7px', color: 'var(--muted)' }}>L{entry.lap}</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--muted2)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.transcript.substring(0, 50)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: copied ? 'var(--green)15' : 'var(--panel)',
                  border: copied ? '1px solid var(--green)' : '1px solid var(--border)',
                  color: copied ? 'var(--green)' : 'var(--text)',
                  fontFamily: 'Orbitron',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  borderRadius: '4px',
                  flexShrink: 0
                }}
              >
                {copied ? '✓ COPIED!' : '📋 SHARE THIS MOMENT'}
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default RadioReplay;
