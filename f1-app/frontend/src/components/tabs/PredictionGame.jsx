import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import RingGauge from '../shared/RingGauge';

const driverTeamColors = {
  VER: '#3671C6', NOR: '#FF8000', HAM: '#27F4D2', LEC: '#E8002D',
  RUS: '#27F4D2', PIA: '#FF8000', ALO: '#229971', SAI: '#0093CC'
};

function PredictionGame() {
  const [raceData, setRaceData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [leaderboardTab, setLeaderboardTab] = useState('race');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raceRes, lbRes] = await Promise.all([
          axios.get('/api/predictions/current-race'),
          axios.get('/api/predictions/leaderboard')
        ]);
        setRaceData(raceRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) {
        console.error('Failed to load predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!raceData) return;
    const target = new Date(raceData.targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [raceData]);

  const handleSelect = (qId, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/predictions/submit', { answers });
      setSubmitted(true);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const allAnswered = raceData?.questions?.every(q => answers[q.id]);

  // Previous results mock for score breakdown
  const previousResults = {
    q1: { answer: 'VER', result: 'NOR' },
    q2: { answer: 'NOR', result: 'NOR' },
    q3: { answer: 'VER', result: 'VER' },
    q4: { answer: 'YES', result: 'YES' },
    q5: { answer: 'NO', result: 'NO' }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '340px 1fr',
      gap: '16px',
      height: '100%',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* LEFT PANEL — MAKE YOUR CALL */}
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="section-header">Race Predictions</div>

        {/* Current Race Card */}
        <div className="panel" style={{
          padding: '14px',
          borderLeft: '3px solid var(--red)'
        }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
            {raceData?.gpName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>
            Round {raceData?.round} — {raceData?.circuit}
          </div>
          <div style={{
            fontSize: '9px',
            color: 'var(--muted)',
            fontFamily: 'Orbitron',
            letterSpacing: '1.5px',
            marginBottom: '6px',
            textTransform: 'uppercase'
          }}>
            Predictions Close In
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: 'DAYS', value: countdown.days },
              { label: 'HRS', value: countdown.hours },
              { label: 'MIN', value: countdown.mins },
              { label: 'SEC', value: countdown.secs }
            ].map(unit => (
              <div key={unit.label} style={{
                flex: 1,
                background: 'var(--panel2)',
                borderRadius: '4px',
                padding: '8px 4px',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 700, color: 'var(--yellow)' }}>
                  {pad(unit.value)}
                </div>
                <div style={{ fontSize: '8px', color: 'var(--muted)', fontFamily: 'Orbitron', letterSpacing: '1px' }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Questions */}
        {raceData?.questions?.map(q => (
          <div key={q.id} className="panel" style={{ padding: '12px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'var(--yellow)20',
              color: 'var(--yellow)',
              fontFamily: 'Orbitron',
              fontSize: '8px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '10px',
              letterSpacing: '0.5px'
            }}>
              +{q.points} PTS
            </div>
            <div style={{
              fontFamily: 'Orbitron',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              color: 'var(--text)',
              marginBottom: '10px'
            }}>
              {q.label}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: q.type === 'driver' ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              {q.options.map(opt => {
                const isSelected = answers[q.id] === opt;
                const teamColor = q.type === 'driver' ? driverTeamColors[opt] : null;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    disabled={submitted}
                    style={{
                      padding: q.type === 'driver' ? '8px 4px' : '10px',
                      background: isSelected ? (teamColor || 'var(--red)') + '25' : 'var(--panel2)',
                      border: isSelected
                        ? `1px solid ${teamColor || 'var(--red)'}`
                        : '1px solid var(--border)',
                      borderLeft: teamColor ? `3px solid ${teamColor}` : undefined,
                      color: isSelected ? '#fff' : 'var(--muted2)',
                      fontFamily: 'Orbitron',
                      fontSize: q.type === 'driver' ? '11px' : '12px',
                      fontWeight: 700,
                      borderRadius: '4px',
                      cursor: submitted ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Lock In Button */}
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitted}
          style={{
            width: '100%',
            padding: '14px',
            background: submitted ? 'var(--green)20' : 'var(--red)',
            border: submitted ? '1px solid var(--green)' : 'none',
            color: submitted ? 'var(--green)' : '#fff',
            fontFamily: 'Orbitron',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            borderRadius: '4px',
            flexShrink: 0
          }}
        >
          {submitted ? 'PREDICTIONS LOCKED ✓' : 'LOCK IN PREDICTIONS'}
        </button>
      </div>

      {/* RIGHT PANEL — LEADERBOARD + RESULTS */}
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['race', 'season'].map(tab => (
            <button
              key={tab}
              onClick={() => setLeaderboardTab(tab)}
              style={{
                padding: '6px 16px',
                background: leaderboardTab === tab ? 'var(--red)' : 'var(--panel2)',
                border: leaderboardTab === tab ? '1px solid var(--red)' : '1px solid var(--border)',
                color: leaderboardTab === tab ? '#fff' : 'var(--muted)',
                fontFamily: 'Orbitron',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                borderRadius: '20px'
              }}
            >
              {tab === 'race' ? 'THIS RACE' : 'SEASON'}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="panel" style={{ padding: '16px' }}>
          <div className="section-header">Leaderboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 70px 80px 60px', gap: '0', fontSize: '9px' }}>
            {/* Header */}
            {['RANK', 'PLAYER', 'CORRECT', 'POINTS', 'STREAK'].map(h => (
              <div key={h} style={{
                fontFamily: 'Orbitron',
                color: 'var(--muted)',
                padding: '6px 4px',
                letterSpacing: '1px',
                borderBottom: '1px solid var(--border)'
              }}>
                {h}
              </div>
            ))}
            {/* Rows */}
            {leaderboard.map((row, idx) => {
              const rankBg = row.rank === 1 ? '#FFD70025' :
                row.rank === 2 ? '#C0C0C025' :
                  row.rank === 3 ? '#CD7F3225' : 'transparent';
              const rankColor = row.rank === 1 ? '#FFD700' :
                row.rank === 2 ? '#C0C0C0' :
                  row.rank === 3 ? '#CD7F32' : 'var(--text)';

              return (
                <motion.div
                  key={row.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{
                    display: 'contents'
                  }}
                >
                  <div style={{
                    padding: '8px 4px',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: row.isCurrentUser ? '2px solid var(--red)' : '2px solid transparent',
                    background: row.isCurrentUser ? 'rgba(232,0,45,0.04)' : 'transparent'
                  }}>
                    <span style={{
                      background: rankBg,
                      color: rankColor,
                      fontFamily: 'Orbitron',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '2px'
                    }}>
                      {row.rank}
                    </span>
                  </div>
                  <div style={{
                    padding: '8px 4px',
                    fontFamily: row.isCurrentUser ? 'Orbitron' : 'Barlow Condensed',
                    fontSize: '13px',
                    fontWeight: row.isCurrentUser ? 700 : 400,
                    color: row.isCurrentUser ? 'var(--red)' : 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    background: row.isCurrentUser ? 'rgba(232,0,45,0.04)' : 'transparent'
                  }}>
                    {row.username}
                  </div>
                  <div style={{
                    padding: '8px 4px',
                    fontFamily: 'Orbitron',
                    fontSize: '12px',
                    borderBottom: '1px solid var(--border)',
                    background: row.isCurrentUser ? 'rgba(232,0,45,0.04)' : 'transparent'
                  }}>
                    {row.correct}
                  </div>
                  <div style={{
                    padding: '8px 4px',
                    fontFamily: 'Orbitron',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--yellow)',
                    borderBottom: '1px solid var(--border)',
                    background: row.isCurrentUser ? 'rgba(232,0,45,0.04)' : 'transparent'
                  }}>
                    {row.points}
                  </div>
                  <div style={{
                    padding: '8px 4px',
                    fontFamily: 'Orbitron',
                    fontSize: '12px',
                    color: row.streak >= 5 ? 'var(--green)' : 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    background: row.isCurrentUser ? 'rgba(232,0,45,0.04)' : 'transparent'
                  }}>
                    🔥{row.streak}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Score Breakdown + Accuracy Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px' }}>
          {/* Score Breakdown */}
          <div className="panel" style={{ padding: '16px' }}>
            <div className="section-header">Your Score Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {raceData?.questions?.map(q => {
                const prev = previousResults[q.id];
                const isCorrect = prev?.answer === prev?.result;
                return (
                  <div key={q.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 60px 60px 60px',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '6px 8px',
                    background: isCorrect ? 'rgba(57,255,20,0.05)' : 'rgba(232,0,45,0.05)',
                    borderLeft: `3px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
                    borderRadius: '0 4px 4px 0',
                    fontSize: '11px'
                  }}>
                    <span style={{ fontFamily: 'Orbitron', fontSize: '8px', letterSpacing: '1px', color: 'var(--muted)' }}>
                      {q.label}
                    </span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: '11px' }}>
                      {prev?.answer}
                    </span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: '11px', color: 'var(--muted2)' }}>
                      {prev?.result}
                    </span>
                    <span style={{
                      fontFamily: 'Orbitron',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isCorrect ? 'var(--green)' : 'var(--red)'
                    }}>
                      {isCorrect ? `+${q.points}` : '0'}
                    </span>
                  </div>
                );
              })}
              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                borderTop: '1px solid var(--border)',
                marginTop: '4px'
              }}>
                <span style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--muted)' }}>TOTAL</span>
                <span style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: 700, color: 'var(--yellow)' }}>
                  {raceData?.questions?.reduce((sum, q) => {
                    const prev = previousResults[q.id];
                    return sum + (prev?.answer === prev?.result ? q.points : 0);
                  }, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Accuracy Stats */}
          <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="section-header">Accuracy Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <RingGauge score={34} size={90} color="#E8002D" />
              <span style={{ fontFamily: 'Orbitron', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px' }}>RACE WINNER</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <RingGauge score={61} size={90} color="#FFD700" />
              <span style={{ fontFamily: 'Orbitron', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px' }}>OVERALL</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '32px', fontWeight: 700, color: 'var(--green)' }}>4</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px' }}>CURRENT STREAK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionGame;
