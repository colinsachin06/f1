import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

const BENCHMARKS = {
  worldRecord: 1.80,
  f1Average: 2.4,
  amateurTarget: 3.5
};

const getRating = (time) => {
  if (time < 2.0) return { label: 'F1 WORLD CLASS', color: '#FFD700', glow: true };
  if (time < 2.5) return { label: 'PRO CREW', color: '#39FF14', glow: false };
  if (time < 3.0) return { label: 'SEMI-PRO', color: '#FFD700', glow: false };
  if (time < 4.0) return { label: 'AMATEUR', color: '#FF8000', glow: false };
  return { label: 'ROOKIE', color: '#E8002D', glow: false };
};

function PitStopChallenge() {
  const [mode, setMode] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, waiting, go, tooEarly, result
  const [resultTime, setResultTime] = useState(null);
  const [lights, setLights] = useState([false, false, false, false, false]);

  // Reaction timer state
  const goTimeRef = useRef(null);
  const waitTimeoutRef = useRef(null);

  // Sequence timer state
  const [seqStep, setSeqStep] = useState(0);
  const [seqHighlight, setSeqHighlight] = useState(-1);
  const seqStartRef = useRef(null);
  const [seqError, setSeqError] = useState(false);

  // Endurance state
  const [enduranceRound, setEnduranceRound] = useState(0);
  const [enduranceTimes, setEnduranceTimes] = useState([]);
  const [enduranceResting, setEnduranceResting] = useState(false);

  // Shared
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const seqLabels = ['JACK', 'GUNS', 'TYRES', 'JACK DOWN'];

  // Personal bests from localStorage
  const getPB = (m) => {
    try {
      return parseFloat(localStorage.getItem(`pitwall_pb_${m}`)) || null;
    } catch { return null; }
  };

  const setPB = (m, time) => {
    try {
      const current = getPB(m);
      if (!current || time < current) {
        localStorage.setItem(`pitwall_pb_${m}`, time.toString());
        return true;
      }
    } catch { /* ignore */ }
    return false;
  };

  const [isNewPB, setIsNewPB] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    };
  }, []);

  // ═══ MODE A: REACTION TIMER ═══
  const startReaction = useCallback(() => {
    setGameState('waiting');
    setShowResult(false);
    setResultTime(null);
    setIsNewPB(false);
    setLights([false, false, false, false, false]);

    // Light up sequence
    const lightDelay = 500;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setLights(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * lightDelay);
    }

    // After all lights on, random delay then GO
    const totalLightTime = 5 * lightDelay;
    const randomDelay = 1500 + Math.random() * 2500;

    waitTimeoutRef.current = setTimeout(() => {
      setLights([false, false, false, false, false]);
      setGameState('go');
      goTimeRef.current = performance.now();
    }, totalLightTime + randomDelay);
  }, []);

  const handleReactionClick = useCallback(() => {
    if (gameState === 'idle') {
      startReaction();
      return;
    }
    if (gameState === 'waiting') {
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
      setGameState('tooEarly');
      setLights([false, false, false, false, false]);
      setTimeout(() => setGameState('idle'), 1500);
      return;
    }
    if (gameState === 'go') {
      const elapsed = (performance.now() - goTimeRef.current) / 1000;
      const time = Math.round(elapsed * 1000) / 1000;
      setResultTime(time);
      setGameState('result');
      setShowResult(true);

      const modeKey = mode === 'endurance' ? 'endurance' : 'reaction';
      const newPB = setPB(modeKey, time);
      setIsNewPB(newPB);

      // Endurance mode handling
      if (mode === 'endurance') {
        const newTimes = [...enduranceTimes, time];
        setEnduranceTimes(newTimes);
        if (newTimes.length < 5) {
          setEnduranceResting(true);
          setTimeout(() => {
            setEnduranceResting(false);
            setEnduranceRound(prev => prev + 1);
            startReaction();
          }, 2000);
        } else {
          // All 5 done - show average
          const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
          setResultTime(Math.round(avg * 1000) / 1000);
          const newAvgPB = setPB('endurance', Math.round(avg * 1000) / 1000);
          setIsNewPB(newAvgPB);
        }
      }
    }
  }, [gameState, mode, enduranceTimes, startReaction]);

  // ═══ MODE B: SEQUENCE TIMER ═══
  const startSequence = useCallback(() => {
    setSeqStep(0);
    setSeqError(false);
    setShowResult(false);
    setResultTime(null);
    setIsNewPB(false);
    setGameState('go');
    // Highlight first button
    setSeqHighlight(0);
    seqStartRef.current = null;
  }, []);

  const handleSeqClick = useCallback((idx) => {
    if (idx !== seqHighlight) {
      setSeqError(true);
      setTimeout(() => {
        setSeqError(false);
        setSeqStep(0);
        setSeqHighlight(0);
        seqStartRef.current = null;
      }, 800);
      return;
    }

    if (seqStep === 0) {
      seqStartRef.current = performance.now();
    }

    const nextStep = seqStep + 1;
    if (nextStep >= 4) {
      const elapsed = (performance.now() - seqStartRef.current) / 1000;
      const time = Math.round(elapsed * 1000) / 1000;
      setResultTime(time);
      setGameState('result');
      setShowResult(true);
      setSeqHighlight(-1);
      const newPB = setPB('sequence', time);
      setIsNewPB(newPB);
    } else {
      setSeqStep(nextStep);
      setSeqHighlight(nextStep);
    }
  }, [seqHighlight, seqStep]);

  const reset = () => {
    setGameState('idle');
    setShowResult(false);
    setResultTime(null);
    setIsNewPB(false);
    setEnduranceRound(0);
    setEnduranceTimes([]);
    setEnduranceResting(false);
    setSeqStep(0);
    setSeqHighlight(-1);
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
  };

  const tryAgain = () => {
    reset();
    if (mode === 'reaction' || mode === 'endurance') {
      startReaction();
    } else if (mode === 'sequence') {
      startSequence();
    }
  };

  const handleShare = () => {
    if (!resultTime) return;
    const rating = getRating(resultTime);
    const text = `I just did a ${resultTime.toFixed(3)}s pit stop on PitWall Analytics! Rating: ${rating.label} 🏎️ #F1 #PitStop`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentPB = mode ? getPB(mode) : null;

  // Chart data for results
  const comparisonData = resultTime ? {
    labels: ['Your Time', 'World Record', 'F1 Average', 'Amateur Target'],
    datasets: [{
      data: [resultTime, BENCHMARKS.worldRecord, BENCHMARKS.f1Average, BENCHMARKS.amateurTarget],
      backgroundColor: [
        getRating(resultTime).color + '80',
        '#FFD70080',
        '#FF800080',
        '#E8002D80'
      ],
      borderColor: [
        getRating(resultTime).color,
        '#FFD700',
        '#FF8000',
        '#E8002D'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  } : null;

  const comparisonOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: 'rgba(255,255,255,0.3)',
          callback: (v) => v.toFixed(1) + 's'
        }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
      }
    }
  };

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* SECTION 1 — THE CHALLENGE */}
        <div className="panel" style={{ padding: '20px', borderTop: '3px solid var(--red)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
            PIT STOP CHALLENGE
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
            React as fast as an F1 pit crew
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'F1 WORLD RECORD', value: '1.80s', sub: 'Red Bull, 2019' },
              { label: 'F1 AVERAGE', value: '2.4s', sub: 'Across grid' },
              { label: 'AMATEUR TARGET', value: '<3.5s', sub: 'Your goal' }
            ].map(b => (
              <div key={b.label} className="panel" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Orbitron', fontSize: '22px', fontWeight: 700, color: 'var(--yellow)' }}>
                  {b.value}
                </div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '7px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '4px' }}>
                  {b.label}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--muted2)', marginTop: '2px' }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2 — SELECT MODE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { id: 'reaction', icon: '🔴', title: 'REACTION TIMER', desc: 'Click STOP when you see the green light' },
            { id: 'sequence', icon: '🔵', title: 'SEQUENCE TIMER', desc: 'Click 4 buttons in order as fast as possible' },
            { id: 'endurance', icon: '⚡', title: 'ENDURANCE', desc: 'Complete 5 pit stops, your average is your score' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { reset(); setMode(m.id); }}
              className="panel"
              style={{
                padding: '14px',
                background: mode === m.id ? 'rgba(232,0,45,0.08)' : 'var(--panel)',
                border: mode === m.id ? '1px solid var(--red)' : '1px solid var(--border)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{m.icon}</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, marginBottom: '4px', letterSpacing: '1px' }}>
                {m.title}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.4 }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* SECTION 3 — PIT LANE (Game Area) */}
        {mode && (
          <div className="panel" style={{ padding: '24px' }}>
            <div className="section-header" style={{ textAlign: 'center' }}>Pit Lane</div>

            {/* MODE A & C — REACTION TIMER */}
            {(mode === 'reaction' || mode === 'endurance') && (
              <div style={{ textAlign: 'center' }}>
                {/* Endurance progress */}
                {mode === 'endurance' && (
                  <div style={{
                    fontFamily: 'Orbitron',
                    fontSize: '10px',
                    color: 'var(--muted)',
                    letterSpacing: '1.5px',
                    marginBottom: '12px'
                  }}>
                    STOP {Math.min(enduranceTimes.length + 1, 5)} OF 5
                    {enduranceResting && (
                      <span style={{ color: 'var(--yellow)', marginLeft: '10px' }}>
                        LAST: {enduranceTimes[enduranceTimes.length - 1]?.toFixed(3)}s
                      </span>
                    )}
                  </div>
                )}

                {/* F1 Start Lights */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {lights.map((lit, idx) => (
                    <div key={idx} style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: lit ? '#E8002D' : '#1C1F28',
                      border: '2px solid #333',
                      boxShadow: lit ? '0 0 16px #E8002D, 0 0 32px #E8002D60' : 'none',
                      transition: 'all 0.15s'
                    }} />
                  ))}
                </div>

                {/* Main Circle */}
                <motion.div
                  onClick={handleReactionClick}
                  animate={gameState === 'tooEarly' ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background:
                      gameState === 'idle' ? '#1C1F28' :
                      gameState === 'waiting' ? '#E8002D' :
                      gameState === 'go' ? '#39FF14' :
                      gameState === 'tooEarly' ? '#E8002D' :
                      '#1C1F28',
                    border: `3px solid ${
                      gameState === 'idle' ? 'var(--border2)' :
                      gameState === 'go' ? '#39FF14' :
                      gameState === 'tooEarly' ? '#E8002D' :
                      'var(--red)'
                    }`,
                    boxShadow: gameState === 'go' ? '0 0 40px #39FF1460, 0 0 80px #39FF1420' : 'none',
                    animation: gameState === 'idle' ? 'pulse 2s infinite' : 'none',
                    transition: 'background 0.1s, border 0.1s, box-shadow 0.2s',
                    userSelect: 'none'
                  }}
                >
                  <div style={{
                    fontFamily: 'Orbitron',
                    fontSize: gameState === 'result' ? '24px' : '16px',
                    fontWeight: 700,
                    color: gameState === 'go' ? '#000' : '#fff',
                    letterSpacing: '2px'
                  }}>
                    {gameState === 'idle' && 'TAP TO START'}
                    {gameState === 'waiting' && 'WAIT...'}
                    {gameState === 'go' && 'STOP!'}
                    {gameState === 'tooEarly' && 'TOO EARLY!'}
                    {gameState === 'result' && `${resultTime?.toFixed(3)}s`}
                  </div>
                </motion.div>
              </div>
            )}

            {/* MODE B — SEQUENCE TIMER */}
            {mode === 'sequence' && (
              <div style={{ textAlign: 'center' }}>
                {gameState === 'idle' ? (
                  <button
                    onClick={startSequence}
                    style={{
                      padding: '14px 32px',
                      background: 'var(--red)',
                      color: '#fff',
                      fontFamily: 'Orbitron',
                      fontSize: '14px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      borderRadius: '4px',
                      margin: '20px 0'
                    }}
                  >
                    START SEQUENCE
                  </button>
                ) : gameState === 'go' ? (
                  <>
                    <div style={{
                      fontFamily: 'Orbitron',
                      fontSize: '10px',
                      color: 'var(--muted)',
                      letterSpacing: '1.5px',
                      marginBottom: '16px'
                    }}>
                      STEP {seqStep + 1} OF 4
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
                      {seqLabels.map((label, idx) => (
                        <motion.button
                          key={label}
                          onClick={() => handleSeqClick(idx)}
                          animate={seqError && idx === seqHighlight ? { x: [-3, 3, -3, 3, 0] } : {}}
                          style={{
                            padding: '24px',
                            background: idx === seqHighlight ? '#FFD70020' : idx < seqStep ? '#39FF1415' : 'var(--panel2)',
                            border: idx === seqHighlight
                              ? '2px solid var(--yellow)'
                              : idx < seqStep ? '2px solid var(--green)' : '2px solid var(--border)',
                            boxShadow: idx === seqHighlight ? '0 0 20px #FFD70040' : 'none',
                            color: idx === seqHighlight ? 'var(--yellow)' : idx < seqStep ? 'var(--green)' : 'var(--muted)',
                            fontFamily: 'Orbitron',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {idx < seqStep ? '✓' : label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4 — RESULTS */}
        <AnimatePresence>
          {showResult && resultTime !== null && !(mode === 'endurance' && enduranceTimes.length < 5) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Main result card */}
              <div className="panel" style={{ padding: '24px', textAlign: 'center' }}>
                {isNewPB && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      padding: '6px 16px',
                      background: '#FFD70020',
                      border: '1px solid var(--yellow)',
                      borderRadius: '20px',
                      fontFamily: 'Orbitron',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--yellow)',
                      letterSpacing: '1.5px',
                      display: 'inline-block',
                      marginBottom: '12px'
                    }}
                  >
                    🏆 NEW PERSONAL BEST!
                  </motion.div>
                )}
                <div style={{
                  fontFamily: 'Orbitron',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: getRating(resultTime).color,
                  textShadow: getRating(resultTime).glow ? `0 0 30px ${getRating(resultTime).color}60` : 'none'
                }}>
                  {resultTime.toFixed(3)}s
                </div>
                <div style={{
                  fontFamily: 'Orbitron',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  color: getRating(resultTime).color,
                  marginTop: '8px'
                }}>
                  {getRating(resultTime).label}
                </div>
                {mode === 'endurance' && (
                  <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)' }}>
                    Times: {enduranceTimes.map(t => t.toFixed(3) + 's').join(' → ')}
                  </div>
                )}
              </div>

              {/* Comparison Bar Chart */}
              <div className="panel" style={{ padding: '16px' }}>
                <div className="section-header">Time Comparison</div>
                <div style={{ height: '160px' }}>
                  <Bar data={comparisonData} options={comparisonOptions} />
                </div>
              </div>

              {/* Personal Best */}
              {currentPB && (
                <div className="panel" style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Orbitron', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px' }}>YOUR BEST: </span>
                  <span style={{ fontFamily: 'Orbitron', fontSize: '16px', fontWeight: 700, color: 'var(--yellow)' }}>
                    {currentPB.toFixed(3)}s
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={tryAgain}
                  style={{
                    padding: '14px',
                    background: 'var(--red)',
                    color: '#fff',
                    fontFamily: 'Orbitron',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    borderRadius: '4px'
                  }}
                >
                  TRY AGAIN
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    padding: '14px',
                    background: copied ? 'var(--green)15' : 'var(--panel)',
                    border: copied ? '1px solid var(--green)' : '1px solid var(--border)',
                    color: copied ? 'var(--green)' : 'var(--text)',
                    fontFamily: 'Orbitron',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    borderRadius: '4px'
                  }}
                >
                  {copied ? '✓ COPIED!' : 'SHARE RESULT'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PitStopChallenge;
