import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import axios from 'axios';
import RingGauge from '../shared/RingGauge';

function SimBenchmarker({ circuits, loading: circuitsLoading }) {
  const [selectedCircuit, setSelectedCircuit] = useState('bahrain');
  const [lapTime, setLapTime] = useState('1:30.000');
  const [platform, setPlatform] = useState('iRacing');
  const [skillLevel, setSkillLevel] = useState('amateur');
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const platforms = ['iRacing', 'Assetto Corsa', 'rFactor2', 'Custom'];
  const skillLevels = ['rookie', 'amateur', 'semi-pro', 'pro'];

  const analyzeLap = async () => {
    const timeRegex = /^\d:\d{2}\.\d{3}$/;
    if (!timeRegex.test(lapTime)) {
      setError('Invalid format. Use M:SS.mmm (e.g., 1:30.000)');
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      const response = await axios.get('/api/sim/analyze', {
        params: {
          circuit: selectedCircuit,
          lactime: lapTime,
          platform: platform.toLowerCase().replace(' ', '-').replace('assetto-corsa', 'assetto-corsa'),
          level: skillLevel
        }
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to analyze lap. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (circuitsLoading) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  const formatMs = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  };

  const formatDelta = (delta) => {
    const sign = delta >= 0 ? '+' : '';
    return `${sign}${(delta / 1000).toFixed(3)}s`;
  };

  const comparisonData = results ? {
    labels: ['Your Time', 'F1 Race Pace', 'F1 Quali Record', 'F1 Race Record', 'Sim World Record'],
    datasets: [{
      data: [
        results.userTimeMs,
        results.f1AvgPace,
        results.f1QualiRecord,
        results.f1RaceRecord,
        results.simWorldRecord
      ],
      backgroundColor: [
        results.pctFromF1Quali <= 2 ? '#39FF14' : 
        results.pctFromF1Quali <= 5 ? '#FFD700' : '#E8002D',
        '#FF8000',
        '#BF00FF',
        '#E8002D',
        '#00CFFF'
      ],
      borderRadius: 4
    }]
  } : null;

  const comparisonOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: 'rgba(255,255,255,0.3)',
          callback: (value) => formatMs(value)
        }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } }
      }
    }
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '16px',
    height: '100%',
    padding: '16px',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      {/* Left Panel: Input Form */}
      <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="section-header">Simulation Input</div>

        {/* Circuit Select */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Circuit
          </label>
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            style={{ width: '100%' }}
          >
            {circuits?.map(c => (
              <option key={c.id} value={c.id}>{c.flagEmoji} {c.name.replace(' International Circuit', '').replace('Autodromo ', '')}</option>
            ))}
          </select>
        </div>

        {/* Lap Time Input */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Lap Time
          </label>
          <input
            type="text"
            value={lapTime}
            onChange={(e) => setLapTime(e.target.value)}
            placeholder="M:SS.mmm"
            style={{ 
              width: '100%',
              borderColor: error ? 'var(--red)' : 'var(--border)'
            }}
          />
          {error && <div style={{ color: 'var(--red)', fontSize: '10px', marginTop: '4px' }}>{error}</div>}
        </div>

        {/* Platform Toggle */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Platform
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={{
                  padding: '8px',
                  background: platform === p ? 'var(--red)' : 'var(--panel2)',
                  border: platform === p ? '1px solid var(--red)' : '1px solid var(--border)',
                  color: platform === p ? '#fff' : 'var(--text)',
                  fontSize: '9px',
                  borderRadius: '4px'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Skill Level
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skillLevels.map(level => (
              <button
                key={level}
                onClick={() => setSkillLevel(level)}
                style={{
                  padding: '8px 12px',
                  background: skillLevel === level ? 'var(--red)' : 'var(--panel2)',
                  border: skillLevel === level ? '1px solid var(--red)' : '1px solid var(--border)',
                  color: skillLevel === level ? '#fff' : 'var(--text)',
                  fontSize: '9px',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzeLap}
          disabled={analyzing}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--red)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            borderRadius: '4px',
            marginTop: 'auto'
          }}
        >
          {analyzing ? 'ANALYZING...' : 'ANALYZE LAP ▶'}
        </button>
      </div>

      {/* Right Panel: Results */}
      <div style={{ overflow: 'auto' }}>
        {!results ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--muted)',
            fontFamily: 'Orbitron',
            fontSize: '12px'
          }}>
            Enter lap time and click ANALYZE to see results
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Lap Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="panel"
              style={{ padding: '16px' }}
            >
              <div className="section-header">
                {circuits?.find(c => c.id === selectedCircuit)?.name?.replace(' International Circuit', '')} — LAP TIME COMPARISON
              </div>
              <div style={{ height: '180px' }}>
                <Bar data={comparisonData} options={comparisonOptions} />
              </div>
            </motion.div>

            {/* Sector Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="panel"
              style={{ padding: '16px' }}
            >
              <div className="section-header">Sector Breakdown</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['s1', 's2', 's3'].map((sector, idx) => {
                  const userTime = results.sectorSplits[sector];
                  const f1Time = results.f1SectorBenchmarks[sector];
                  const delta = userTime - f1Time;
                  
                  let bgColor = 'var(--red)';
                  if (delta < 0) bgColor = '#BF00FF';
                  else if (delta < 300) bgColor = 'var(--green)';
                  else if (delta < 800) bgColor = 'var(--yellow)';

                  return (
                    <div
                      key={sector}
                      style={{
                        background: bgColor + '15',
                        border: `1px solid ${bgColor}40`,
                        borderRadius: '4px',
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 700 }}>
                        {formatMs(userTime)}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: delta < 0 ? '#BF00FF' : delta < 800 ? 'var(--text)' : 'var(--red)',
                        marginTop: '4px'
                      }}>
                        {formatDelta(delta)}
                      </div>
                      <div style={{ 
                        height: '4px', 
                        background: 'var(--border2)', 
                        borderRadius: '2px', 
                        marginTop: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${(userTime / (results.userTimeMs)) * 100}%`,
                          height: '100%',
                          background: bgColor
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Performance Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="panel"
              style={{ padding: '16px', textAlign: 'center' }}
            >
              <div className="section-header">Performance Rating</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <RingGauge score={results.performanceScore} size={140} />
                <div style={{ 
                  fontFamily: 'Orbitron', 
                  fontSize: '14px', 
                  letterSpacing: '2px',
                  color: results.performanceScore >= 80 ? 'var(--green)' : 
                         results.performanceScore >= 60 ? 'var(--yellow)' : 
                         results.performanceScore >= 40 ? 'var(--orange)' : 'var(--red)'
                }}>
                  {results.ratingLabel}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {results.strengths.map((s, i) => (
                    <span key={i} style={{
                      background: 'var(--green)20',
                      color: 'var(--green)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontFamily: 'Orbitron'
                    }}>
                      {s}
                    </span>
                  ))}
                  {results.weaknesses.map((w, i) => (
                    <span key={i} style={{
                      background: 'var(--red)20',
                      color: 'var(--red)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontFamily: 'Orbitron'
                    }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Improvement Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="panel"
              style={{ padding: '16px' }}
            >
              <div className="section-header">Improvement Tips</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: '2px solid var(--red)',
                      background: 'var(--panel2)',
                      padding: '10px 12px',
                      borderRadius: '0 4px 4px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <span style={{
                      fontFamily: 'Orbitron',
                      fontSize: '10px',
                      color: 'var(--muted)'
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontFamily: 'Barlow',
                      fontSize: '12px',
                      lineHeight: 1.6
                    }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SimBenchmarker;
