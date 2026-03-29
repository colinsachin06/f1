import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import axios from 'axios';

const driverList = [
  { code: 'VER', team: 'Red Bull', color: '#3671C6' },
  { code: 'NOR', team: 'McLaren', color: '#FF8000' },
  { code: 'HAM', team: 'Mercedes', color: '#27F4D2' },
  { code: 'LEC', team: 'Ferrari', color: '#E8002D' },
  { code: 'RUS', team: 'Mercedes', color: '#27F4D2' },
  { code: 'PIA', team: 'McLaren', color: '#FF8000' },
  { code: 'ALO', team: 'Aston Martin', color: '#229971' },
  { code: 'SAI', team: 'Williams', color: '#0093CC' }
];

function SentimentTracker() {
  const [selectedDriver, setSelectedDriver] = useState('VER');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/sentiment/${selectedDriver}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch sentiment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, [selectedDriver]);

  // Animate score count-up
  useEffect(() => {
    if (!data) return;
    const target = data.currentScore;
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [data]);

  const getSentimentColor = (label) => {
    if (label === 'Positive') return 'var(--green)';
    if (label === 'Negative') return 'var(--red)';
    return 'var(--yellow)';
  };

  const getSentimentArrow = (code) => {
    const arrows = { VER: '→', NOR: '↑', HAM: '→', LEC: '↑', RUS: '↓', PIA: '↑', ALO: '↓', SAI: '→' };
    return arrows[code] || '→';
  };

  if (loading && !data) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  // Chart data
  const timelineChartData = data ? {
    labels: data.timeline.map(t => t.race),
    datasets: [
      {
        label: 'Fan Sentiment',
        data: data.timeline.map(t => t.raceDay),
        borderColor: data.teamColor || driverList.find(d => d.code === selectedDriver)?.color,
        backgroundColor: (data.teamColor || '#fff') + '20',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2.5
      },
      {
        label: 'Media Sentiment',
        data: data.timeline.map(t => t.quali),
        borderColor: (data.teamColor || '#fff') + '80',
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        borderWidth: 1.5,
        borderDash: [6, 3]
      }
    ]
  } : null;

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200 },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Orbitron', size: 9 },
          boxWidth: 12,
          padding: 8
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const race = data.timeline[context.dataIndex];
            return `${context.dataset.label}: ${context.raw} | Race: ${race.race}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 }, maxRotation: 45 }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      }
    }
  };

  const donutData = data ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [data.breakdown.positive, data.breakdown.neutral, data.breakdown.negative],
      backgroundColor: ['#39FF1440', '#FFD70040', '#E8002D40'],
      borderColor: ['#39FF14', '#FFD700', '#E8002D'],
      borderWidth: 2,
      hoverOffset: 6
    }]
  } : null;

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false }
    }
  };

  const teamColor = data?.teamColor || driverList.find(d => d.code === selectedDriver)?.color || '#fff';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '16px',
      overflow: 'hidden',
      gap: '12px'
    }}>
      {/* TOP ROW — Driver Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        flexShrink: 0,
        paddingBottom: '4px'
      }}>
        {driverList.map(d => (
          <button
            key={d.code}
            onClick={() => setSelectedDriver(d.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: selectedDriver === d.code ? 'rgba(232,0,45,0.1)' : 'var(--panel)',
              border: selectedDriver === d.code ? '1px solid var(--red)' : '1px solid var(--border)',
              color: selectedDriver === d.code ? '#fff' : 'var(--muted2)',
              fontFamily: 'Orbitron',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: d.color,
              flexShrink: 0
            }} />
            {d.code}
            <span style={{
              color: getSentimentArrow(d.code) === '↑' ? 'var(--green)' :
                getSentimentArrow(d.code) === '↓' ? 'var(--red)' : 'var(--yellow)',
              fontSize: '12px'
            }}>
              {getSentimentArrow(d.code)}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN GRID */}
      {data && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '55fr 45fr',
          gap: '16px',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* LEFT — Sentiment Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
            <div className="panel" style={{ padding: '16px', flex: 1, minHeight: '260px' }}>
              <div className="section-header">Sentiment Timeline</div>
              <div style={{ height: 'calc(100% - 30px)' }}>
                <Line data={timelineChartData} options={timelineOptions} key={selectedDriver} />
              </div>
            </div>

            {/* Event Feed */}
            <div className="panel" style={{ padding: '12px' }}>
              <div className="section-header">Recent Events</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.recentEvents.map((evt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '8px',
                      background: 'var(--panel2)',
                      borderLeft: `3px solid ${evt.delta > 0 ? 'var(--green)' : 'var(--red)'}`,
                      borderRadius: '0 4px 4px 0'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{evt.time}</span>
                        <span style={{
                          padding: '1px 6px',
                          background: evt.source === 'TWITTER' ? '#1DA1F220' :
                            evt.source === 'REDDIT' ? '#FF450020' : '#BF00FF20',
                          color: evt.source === 'TWITTER' ? '#1DA1F2' :
                            evt.source === 'REDDIT' ? '#FF4500' : '#BF00FF',
                          fontSize: '8px',
                          fontFamily: 'Orbitron',
                          borderRadius: '2px',
                          letterSpacing: '0.5px'
                        }}>
                          {evt.source}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', lineHeight: 1.4, color: 'var(--text)' }}>{evt.text}</div>
                    </div>
                    <span style={{
                      fontFamily: 'Orbitron',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: evt.delta > 0 ? 'var(--green)' : 'var(--red)',
                      flexShrink: 0
                    }}>
                      {evt.delta > 0 ? '+' : ''}{evt.delta}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Current Mood Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
            {/* Big Score */}
            <motion.div
              className="panel"
              style={{ padding: '20px', textAlign: 'center' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={selectedDriver + '-score'}
            >
              <div className="section-header">Current Mood</div>
              <div style={{
                fontFamily: 'Orbitron',
                fontSize: '64px',
                fontWeight: 700,
                color: getSentimentColor(data.label),
                lineHeight: 1
              }}>
                {animatedScore}
              </div>
              <div style={{
                fontFamily: 'Orbitron',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '3px',
                color: getSentimentColor(data.label),
                marginTop: '8px'
              }}>
                {data.label.toUpperCase()}
              </div>
            </motion.div>

            {/* Donut Chart */}
            <div className="panel" style={{ padding: '16px', position: 'relative' }}>
              <div className="section-header">Sentiment Breakdown</div>
              <div style={{ height: '160px', position: 'relative' }}>
                <Doughnut data={donutData} options={donutOptions} key={selectedDriver + '-donut'} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Orbitron',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: teamColor
                }}>
                  {selectedDriver}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                {[
                  { label: 'Positive', value: data.breakdown.positive, color: 'var(--green)' },
                  { label: 'Neutral', value: data.breakdown.neutral, color: 'var(--yellow)' },
                  { label: 'Negative', value: data.breakdown.negative, color: 'var(--red)' }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 700, color: item.color }}>
                      {item.value}%
                    </div>
                    <div style={{ fontSize: '8px', color: 'var(--muted)', fontFamily: 'Orbitron', letterSpacing: '0.5px' }}>
                      {item.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="panel" style={{ padding: '12px' }}>
              <div className="section-header">Trending Topics</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.trending.map((topic, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px'
                    }}
                  >
                    <span style={{
                      padding: '3px 10px',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: 'var(--text)'
                    }}>
                      {topic.tag}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted2)', fontFamily: 'Barlow Condensed' }}>
                        {topic.mentions >= 1000 ? `${(topic.mentions / 1000).toFixed(1)}k` : topic.mentions}
                      </span>
                      <span style={{
                        color: topic.trend === 'up' ? 'var(--green)' :
                          topic.trend === 'down' ? 'var(--red)' : 'var(--yellow)',
                        fontSize: '14px'
                      }}>
                        {topic.trend === 'up' ? '↑' : topic.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="panel" style={{ padding: '12px' }}>
              <div className="section-header">Platform Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.platforms.map((platform, idx) => {
                  const barColor = platform.score >= 70 ? 'var(--green)' :
                    platform.score >= 50 ? 'var(--yellow)' : 'var(--red)';
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--muted2)',
                        width: '80px',
                        flexShrink: 0,
                        fontFamily: 'Barlow Condensed'
                      }}>
                        {platform.name}
                      </span>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        background: 'var(--border)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${platform.pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          style={{
                            height: '100%',
                            background: barColor,
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span style={{
                        fontFamily: 'Orbitron',
                        fontSize: '10px',
                        color: barColor,
                        width: '35px',
                        textAlign: 'right',
                        flexShrink: 0
                      }}>
                        {platform.pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SentimentTracker;
