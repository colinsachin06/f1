import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const formDotColors = {
  5: '#FFD700',  // win (gold)
  4: '#C0C0C0',  // podium (silver)
  3: '#39FF14',  // points (green)
  2: '#E8002D',  // DNF (red)
  1: '#4E5266'   // no points (muted)
};

function FantasyF1() {
  const [allDrivers, setAllDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const BUDGET = 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          axios.get('/api/fantasy/drivers'),
          axios.get('/api/fantasy/constructors')
        ]);
        setAllDrivers(dRes.data);
        setConstructors(cRes.data);
      } catch (err) {
        console.error('Failed to load fantasy data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCost = useMemo(() => {
    const driverCost = selectedDrivers.reduce((sum, d) => sum + d.price, 0);
    const conCost = selectedConstructor?.price || 0;
    return Math.round((driverCost + conCost) * 10) / 10;
  }, [selectedDrivers, selectedConstructor]);

  const remaining = Math.round((BUDGET - totalCost) * 10) / 10;
  const budgetPct = Math.min((totalCost / BUDGET) * 100, 100);
  const budgetColor = budgetPct < 50 ? 'var(--green)' : budgetPct < 75 ? 'var(--yellow)' : budgetPct < 90 ? 'var(--orange)' : 'var(--red)';

  const teamCounts = useMemo(() => {
    const counts = {};
    selectedDrivers.forEach(d => { counts[d.team] = (counts[d.team] || 0) + 1; });
    return counts;
  }, [selectedDrivers]);

  const canAddDriver = (driver) => {
    if (selectedDrivers.length >= 5) return false;
    if (selectedDrivers.find(d => d.id === driver.id)) return false;
    if ((teamCounts[driver.team] || 0) >= 2) return false;
    if (remaining < driver.price) return false;
    return true;
  };

  const removeDriver = (id) => {
    setSelectedDrivers(prev => prev.filter(d => d.id !== id));
    if (captain === id) setCaptain(null);
  };

  const filteredDrivers = useMemo(() => {
    let filtered = allDrivers.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.team.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'form') filtered.sort((a, b) => b.form.reduce((s, v) => s + v, 0) - a.form.reduce((s, v) => s + v, 0));
    else if (sortBy === 'team') filtered.sort((a, b) => a.team.localeCompare(b.team));
    return filtered;
  }, [allDrivers, search, sortBy]);

  const predictedTotal = useMemo(() => {
    const dPts = selectedDrivers.reduce((sum, d) => {
      const pts = d.predictedPoints;
      return sum + (d.id === captain ? pts * 2 : pts);
    }, 0);
    const cPts = selectedConstructor?.predictedPoints || 0;
    return dPts + cPts;
  }, [selectedDrivers, selectedConstructor, captain]);

  const formScore = useMemo(() => {
    if (selectedDrivers.length === 0) return 0;
    const total = selectedDrivers.reduce((sum, d) => sum + d.form.reduce((s, v) => s + v, 0), 0);
    return Math.round(total / selectedDrivers.length);
  }, [selectedDrivers]);

  const riskLevel = useMemo(() => {
    const avgOwnership = selectedDrivers.length > 0
      ? selectedDrivers.reduce((sum, d) => sum + d.ownership, 0) / selectedDrivers.length
      : 0;
    if (avgOwnership > 60) return { label: 'SAFE', color: 'var(--green)' };
    if (avgOwnership > 35) return { label: 'MEDIUM', color: 'var(--yellow)' };
    return { label: 'HIGH RISK', color: 'var(--red)' };
  }, [selectedDrivers]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/fantasy/team', {
        drivers: selectedDrivers.map(d => d.id),
        constructor: selectedConstructor?.id,
        captain
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // AI advisor suggestions (hardcoded)
  const suggestions = [
    {
      title: '💡 SWAP SUGGESTION',
      text: `Replace STR ($8M) with SAI ($22M) for +22 predicted pts | costs +$14M`
    },
    {
      title: '💡 VALUE PICK',
      text: `TSU ($11M) has outscored his price bracket by 40% over the last 3 races`
    },
    {
      title: '💡 DIFFERENTIAL',
      text: `GAS ($10M) only 18% owned but has strong Barcelona pace — high upside`
    }
  ];

  // Auto-generate AI analysis when team changes
  useEffect(() => {
    if (selectedDrivers.length < 3) {
      setAiResponse('');
      return;
    }
    const timer = setTimeout(() => {
      setAiLoading(true);
      // Simulate AI response
      setTimeout(() => {
        const codes = selectedDrivers.map(d => d.code).join(', ');
        setAiResponse(
          `**Value Analysis:** ${codes} gives strong coverage across ${new Set(selectedDrivers.map(d => d.team)).size} teams. ` +
          `**Risk:** ${selectedDrivers.filter(d => d.ownership < 30).length > 0 ? 'Low-ownership picks add differential potential but increase volatility.' : 'High-ownership picks reduce risk but limit upside.'} ` +
          `**Captain Pick:** ${selectedDrivers.sort((a, b) => b.predictedPoints - a.predictedPoints)[0]?.code || 'TBD'} has the highest ceiling for Barcelona. Budget efficiency: ${Math.round((predictedTotal / totalCost) * 10) / 10} pts/M$.`
        );
        setAiLoading(false);
      }, 1200);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedDrivers, selectedConstructor, predictedTotal, totalCost]);

  if (loading) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 240px',
      gap: '16px',
      height: '100%',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* LEFT — DRIVER POOL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
        <div className="section-header" style={{ flexShrink: 0 }}>Driver Pool</div>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--yellow)',
          flexShrink: 0
        }}>
          ${remaining.toFixed(1)}M REMAINING
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search drivers..."
          style={{ width: '100%', flexShrink: 0 }}
        />

        {/* Sort Controls */}
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {[
            { key: 'price', label: 'PRICE' },
            { key: 'form', label: 'FORM' },
            { key: 'team', label: 'TEAM' }
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              style={{
                flex: 1,
                padding: '4px',
                background: sortBy === s.key ? 'var(--red)' : 'var(--panel2)',
                border: sortBy === s.key ? '1px solid var(--red)' : '1px solid var(--border)',
                color: sortBy === s.key ? '#fff' : 'var(--muted)',
                fontFamily: 'Orbitron',
                fontSize: '7px',
                letterSpacing: '0.5px',
                borderRadius: '4px'
              }}
            >
              {s.label} ↓
            </button>
          ))}
        </div>

        {/* Driver List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {filteredDrivers.map(driver => {
            const isSelected = selectedDrivers.find(d => d.id === driver.id);
            const canAdd = canAddDriver(driver);
            return (
              <div
                key={driver.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderLeft: `3px solid ${driver.teamColor}`,
                  background: isSelected ? 'rgba(232,0,45,0.06)' : 'transparent',
                  marginBottom: '2px',
                  borderRadius: '0 4px 4px 0',
                  minHeight: '48px'
                }}
              >
                <span style={{
                  background: driver.teamColor,
                  color: '#000',
                  fontFamily: 'Orbitron',
                  fontSize: '8px',
                  fontWeight: 700,
                  padding: '1px 4px',
                  borderRadius: '2px',
                  flexShrink: 0
                }}>
                  {driver.number}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '10px', fontWeight: 700 }}>{driver.code}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{driver.team}</div>
                  <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                    {driver.form.map((f, i) => (
                      <span key={i} style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: formDotColors[f] || '#4E5266'
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--yellow)', flexShrink: 0 }}>
                  ${driver.price}M
                </div>
                {!isSelected && (
                  <button
                    onClick={() => canAdd && setSelectedDrivers(prev => [...prev, driver])}
                    disabled={!canAdd}
                    style={{
                      padding: '3px 8px',
                      background: canAdd ? 'var(--green)20' : 'var(--panel2)',
                      border: canAdd ? '1px solid var(--green)' : '1px solid var(--border)',
                      color: canAdd ? 'var(--green)' : 'var(--muted)',
                      fontFamily: 'Orbitron',
                      fontSize: '7px',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}
                  >
                    + ADD
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Team Constraints */}
        <div style={{
          padding: '8px',
          background: 'var(--panel2)',
          borderRadius: '4px',
          fontSize: '9px',
          color: 'var(--muted)',
          flexShrink: 0
        }}>
          Max 2 drivers per team • Budget $100M • 5 drivers + 1 constructor
        </div>
      </div>

      {/* CENTER — MY TEAM */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
        <div className="section-header">My Team</div>

        {/* Budget Bar */}
        <div style={{ padding: '0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--muted)', fontFamily: 'Orbitron', fontSize: '8px' }}>BUDGET</span>
            <span style={{ fontFamily: 'Orbitron', fontSize: '10px', color: budgetColor }}>
              ${totalCost.toFixed(1)}M / $100M
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: budgetColor, borderRadius: '3px' }}
            />
          </div>
        </div>

        {/* 5 Driver Slots (2+2+1 layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[0, 1, 2, 3].map(idx => {
            const driver = selectedDrivers[idx];
            return (
              <div
                key={idx}
                className="panel"
                style={{
                  padding: '12px',
                  borderStyle: driver ? 'solid' : 'dashed',
                  borderColor: driver ? driver.teamColor + '60' : 'var(--border)',
                  background: driver ? driver.teamColor + '08' : 'var(--panel)',
                  position: 'relative',
                  minHeight: '80px'
                }}
              >
                {driver ? (
                  <>
                    <button
                      onClick={() => removeDriver(driver.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'var(--red)20',
                        border: '1px solid var(--red)',
                        color: 'var(--red)',
                        padding: '1px 6px',
                        fontSize: '9px',
                        borderRadius: '2px'
                      }}
                    >
                      ✕
                    </button>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: 700, color: driver.teamColor }}>
                      {driver.number}
                    </div>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700 }}>{driver.code}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{driver.name}</div>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--yellow)', marginTop: '4px' }}>
                      ${driver.price}M • {driver.predictedPoints} pts
                    </div>
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--muted)',
                    fontFamily: 'Orbitron',
                    fontSize: '9px',
                    letterSpacing: '1px'
                  }}>
                    SELECT DRIVER
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* 5th driver slot centered */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="panel"
            style={{
              width: 'calc(50% - 5px)',
              padding: '12px',
              borderStyle: selectedDrivers[4] ? 'solid' : 'dashed',
              borderColor: selectedDrivers[4] ? selectedDrivers[4].teamColor + '60' : 'var(--border)',
              background: selectedDrivers[4] ? selectedDrivers[4].teamColor + '08' : 'var(--panel)',
              position: 'relative',
              minHeight: '80px'
            }}
          >
            {selectedDrivers[4] ? (
              <>
                <button
                  onClick={() => removeDriver(selectedDrivers[4].id)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'var(--red)20', border: '1px solid var(--red)',
                    color: 'var(--red)', padding: '1px 6px', fontSize: '9px', borderRadius: '2px'
                  }}
                >✕</button>
                <div style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: 700, color: selectedDrivers[4].teamColor }}>
                  {selectedDrivers[4].number}
                </div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700 }}>{selectedDrivers[4].code}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{selectedDrivers[4].name}</div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--yellow)', marginTop: '4px' }}>
                  ${selectedDrivers[4].price}M • {selectedDrivers[4].predictedPoints} pts
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
                color: 'var(--muted)', fontFamily: 'Orbitron', fontSize: '9px', letterSpacing: '1px'
              }}>SELECT DRIVER</div>
            )}
          </div>
        </div>

        {/* Constructor Slot */}
        <div className="panel" style={{
          padding: '12px',
          borderStyle: selectedConstructor ? 'solid' : 'dashed',
          borderColor: selectedConstructor ? selectedConstructor.teamColor + '60' : 'var(--border)',
          background: selectedConstructor ? selectedConstructor.teamColor + '08' : 'var(--panel)'
        }}>
          <div className="section-header" style={{ marginBottom: '8px' }}>Constructor</div>
          {selectedConstructor ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '13px', fontWeight: 700, color: selectedConstructor.teamColor }}>
                  {selectedConstructor.name}
                </div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--yellow)' }}>
                  ${selectedConstructor.price}M • {selectedConstructor.predictedPoints} pts
                </div>
              </div>
              <button
                onClick={() => setSelectedConstructor(null)}
                style={{
                  background: 'var(--red)20', border: '1px solid var(--red)',
                  color: 'var(--red)', padding: '3px 8px', fontSize: '9px', borderRadius: '2px'
                }}
              >✕ REMOVE</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {constructors.map(c => (
                <button
                  key={c.id}
                  onClick={() => remaining >= c.price && setSelectedConstructor(c)}
                  disabled={remaining < c.price}
                  style={{
                    padding: '8px',
                    background: 'var(--panel2)',
                    border: `1px solid ${c.teamColor}40`,
                    borderLeft: `3px solid ${c.teamColor}`,
                    color: 'var(--text)',
                    fontFamily: 'Orbitron',
                    fontSize: '8px',
                    borderRadius: '0 4px 4px 0',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{c.name.split(' ')[0]}</div>
                  <div style={{ color: 'var(--yellow)', marginTop: '2px' }}>${c.price}M</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flexShrink: 0 }}>
          {[
            { label: 'TOTAL COST', value: `$${totalCost.toFixed(1)}M`, color: budgetColor },
            { label: 'PREDICTED PTS', value: predictedTotal, color: 'var(--yellow)' },
            { label: 'FORM SCORE', value: formScore, color: 'var(--cyan)' },
            { label: 'RISK LEVEL', value: riskLevel.label, color: riskLevel.color }
          ].map(stat => (
            <div key={stat.label} className="panel" style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '7px', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={selectedDrivers.length < 5 || !selectedConstructor || saving}
          style={{
            width: '100%',
            padding: '14px',
            background: saved ? 'var(--green)20' : 'var(--red)',
            border: saved ? '1px solid var(--green)' : 'none',
            color: saved ? 'var(--green)' : '#fff',
            fontFamily: 'Orbitron',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            borderRadius: '4px',
            flexShrink: 0
          }}
        >
          {saved ? 'TEAM SAVED ✓' : saving ? 'SAVING...' : 'SAVE TEAM'}
        </button>
      </div>

      {/* RIGHT — AI ADVISOR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-header" style={{ margin: 0 }}>AI Scout</div>
          <span style={{
            padding: '2px 8px',
            background: 'var(--red)20',
            border: '1px solid var(--red)',
            color: 'var(--red)',
            fontFamily: 'Orbitron',
            fontSize: '7px',
            fontWeight: 700,
            borderRadius: '10px',
            letterSpacing: '0.5px'
          }}>
            CLAUDE AI
          </span>
        </div>

        {/* AI Analysis */}
        <div className="panel" style={{
          padding: '14px',
          borderLeft: '3px solid var(--red)',
          minHeight: '80px'
        }}>
          {aiLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '10px' }}>ANALYZING</span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ fontSize: '14px' }}
              >
                ●●●
              </motion.span>
            </div>
          ) : aiResponse ? (
            <div style={{ fontSize: '11px', lineHeight: 1.6, color: 'var(--text)' }}>
              {aiResponse}
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'Orbitron', letterSpacing: '1px' }}>
              SELECT 3+ DRIVERS FOR AI ANALYSIS
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {suggestions.map((sug, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="panel"
              style={{
                padding: '10px',
                borderLeft: '3px solid var(--orange)'
              }}
            >
              <div style={{ fontFamily: 'Orbitron', fontSize: '8px', fontWeight: 700, color: 'var(--orange)', marginBottom: '4px', letterSpacing: '1px' }}>
                {sug.title}
              </div>
              <div style={{ fontSize: '10px', lineHeight: 1.5, color: 'var(--text)' }}>
                {sug.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Captain Picker */}
        {selectedDrivers.length > 0 && (
          <div className="panel" style={{ padding: '12px' }}>
            <div className="section-header" style={{ marginBottom: '8px' }}>Select Captain (2x Points)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {selectedDrivers.map(d => (
                <button
                  key={d.id}
                  onClick={() => setCaptain(d.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: captain === d.id ? '#FFD70015' : 'var(--panel2)',
                    border: captain === d.id ? '1px solid var(--yellow)' : '1px solid var(--border)',
                    color: captain === d.id ? 'var(--yellow)' : 'var(--text)',
                    fontFamily: 'Orbitron',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    textAlign: 'left'
                  }}
                >
                  {captain === d.id && '👑 '}{d.code}
                  <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--muted)' }}>
                    {captain === d.id ? d.predictedPoints * 2 : d.predictedPoints} pts
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FantasyF1;
