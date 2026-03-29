import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const driverList = [
  { code: 'VER', team: 'Red Bull', color: '#3671C6' },
  { code: 'NOR', team: 'McLaren', color: '#FF8000' },
  { code: 'HAM', team: 'Ferrari', color: '#E8002D' },
  { code: 'LEC', team: 'Ferrari', color: '#E8002D' },
  { code: 'RUS', team: 'Mercedes', color: '#27F4D2' },
  { code: 'ALO', team: 'Aston Martin', color: '#229971' },
  { code: 'PIA', team: 'McLaren', color: '#FF8000' },
  { code: 'SAI', team: 'Williams', color: '#0093CC' }
];

const sessions = [
  { id: 'practice', label: 'Practice' },
  { id: 'qualifying', label: 'Qualifying' },
  { id: 'race', label: 'Race' }
];

const lapModes = [
  { id: 'best', label: 'Best Lap' },
  { id: 'last', label: 'Last Lap' },
  { id: 'comparison', label: 'Lap Comparison' }
];

// --- Sub-components ---

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', height: '100%' }}>
      <div className="skeleton" style={{ height: '40px', width: '100%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '16px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton" style={{ height: '200px' }} />
          <div className="skeleton" style={{ height: '140px' }} />
          <div className="skeleton" style={{ height: '140px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton" style={{ height: '280px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, unit, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: '11px', color: 'var(--muted2)', fontFamily: 'Barlow Condensed' }}>{label}</span>
      <span style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, color: color || 'var(--text)' }}>
        {value}{unit && <span style={{ fontSize: '9px', color: 'var(--muted)', marginLeft: '2px' }}>{unit}</span>}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    'Push Lap': 'var(--red)',
    'Cool Down': 'var(--blue)',
    'Data Gathering': 'var(--yellow)',
    'Clean Air': 'var(--green)',
    'Traffic': 'var(--orange)'
  };
  const c = colorMap[status] || 'var(--muted)';
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
      background: c + '18', border: `1px solid ${c}50`, color: c,
      fontFamily: 'Orbitron', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px'
    }}>
      {status?.toUpperCase()}
    </span>
  );
}

function SectorDeltaStrip({ sectors, compareS }) {
  const sectorKeys = ['s1', 's2', 's3'];
  return (
    <div className="panel" style={{ padding: '12px' }}>
      <div className="section-header">SECTOR DELTA</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {sectorKeys.map((key, i) => {
          const own = parseFloat(sectors[key]);
          const ref = parseFloat(compareS[key]);
          const delta = ((own - ref) * 1000).toFixed(0);
          const faster = delta <= 0;
          const c = faster ? 'var(--green)' : 'var(--red)';
          return (
            <motion.div key={key}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                flex: 1, background: c + '15', border: `1px solid ${c}40`, borderRadius: '3px',
                padding: '8px', textAlign: 'center', transformOrigin: 'left'
              }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '4px' }}>
                S{i + 1}
              </div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '13px', fontWeight: 700, color: c }}>
                {faster ? '' : '+'}{delta}<span style={{ fontSize: '8px' }}>ms</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Component ---

function Telemetry() {
  const [selectedDriver, setSelectedDriver] = useState('VER');
  const [selectedSession, setSelectedSession] = useState('qualifying');
  const [selectedLap, setSelectedLap] = useState('best');
  const [data, setData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine compare driver (teammate or next driver)
  const compareDriver = useMemo(() => {
    const teamPairs = { VER: 'RUS', NOR: 'PIA', HAM: 'LEC', LEC: 'HAM', RUS: 'VER', ALO: 'SAI', PIA: 'NOR', SAI: 'ALO' };
    return teamPairs[selectedDriver] || 'NOR';
  }, [selectedDriver]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const [mainRes, compRes] = await Promise.all([
          axios.get(`/api/telemetry?driver=${selectedDriver}&session=${selectedSession}&lap=${selectedLap}`),
          axios.get(`/api/telemetry?driver=${compareDriver}&session=${selectedSession}&lap=${selectedLap}`)
        ]);
        setData(mainRes.data);
        setCompareData(compRes.data);
      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [selectedDriver, selectedSession, selectedLap, compareDriver]);

  // --- Chart configurations ---
  const speedChartData = useMemo(() => {
    if (!data || !compareData) return null;
    const driverColor = driverList.find(d => d.code === selectedDriver)?.color || '#fff';
    const compColor = driverList.find(d => d.code === compareDriver)?.color || '#888';
    return {
      labels: data.telemetryPoints.map(p => p.distance),
      datasets: [
        {
          label: data.driverCode,
          data: data.telemetryPoints.map(p => p.speed),
          borderColor: driverColor, backgroundColor: driverColor + '10',
          tension: 0.3, fill: false, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5
        },
        {
          label: compareData.driverCode,
          data: compareData.telemetryPoints.map(p => p.speed),
          borderColor: compColor + 'AA', backgroundColor: 'transparent',
          tension: 0.3, fill: false, pointRadius: 0, pointHoverRadius: 5,
          borderWidth: 1.5, borderDash: [6, 3]
        }
      ]
    };
  }, [data, compareData, selectedDriver, compareDriver]);

  const throttleBrakeData = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.telemetryPoints.map(p => p.distance),
      datasets: [
        {
          label: 'Throttle',
          data: data.telemetryPoints.map(p => p.throttle),
          borderColor: '#39FF14', backgroundColor: '#39FF1410',
          tension: 0.3, fill: true, pointRadius: 0, borderWidth: 1.5
        },
        {
          label: 'Brake',
          data: data.telemetryPoints.map(p => p.brake),
          borderColor: '#E8002D', backgroundColor: '#E8002D10',
          tension: 0.3, fill: true, pointRadius: 0, borderWidth: 1.5
        }
      ]
    };
  }, [data]);

  const speedChartOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true, position: 'top',
        labels: { color: 'rgba(255,255,255,0.5)', font: { family: 'Orbitron', size: 9 }, boxWidth: 12, padding: 8 }
      },
      tooltip: {
        backgroundColor: '#111318EE', borderColor: '#1C1F28', borderWidth: 1,
        titleFont: { family: 'Orbitron', size: 10 }, bodyFont: { family: 'Barlow Condensed', size: 12 },
        callbacks: {
          title: (items) => `Distance: ${items[0].label}m`,
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} km/h`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'LAP DISTANCE (m)', color: 'rgba(255,255,255,0.25)', font: { family: 'Orbitron', size: 8 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 8 }, maxTicksLimit: 12 }
      },
      y: {
        title: { display: true, text: 'SPEED (km/h)', color: 'rgba(255,255,255,0.25)', font: { family: 'Orbitron', size: 8 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 9 } }
      }
    }
  };

  const throttleOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true, position: 'top',
        labels: { color: 'rgba(255,255,255,0.5)', font: { family: 'Orbitron', size: 9 }, boxWidth: 12, padding: 8 }
      },
      tooltip: {
        backgroundColor: '#111318EE', borderColor: '#1C1F28', borderWidth: 1,
        titleFont: { family: 'Orbitron', size: 10 }, bodyFont: { family: 'Barlow Condensed', size: 12 },
        callbacks: {
          title: (items) => `Distance: ${items[0].label}m`,
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'LAP DISTANCE (m)', color: 'rgba(255,255,255,0.25)', font: { family: 'Orbitron', size: 8 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 8 }, maxTicksLimit: 12 }
      },
      y: {
        min: 0, max: 100,
        title: { display: true, text: 'INPUT %', color: 'rgba(255,255,255,0.25)', font: { family: 'Orbitron', size: 8 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 9 } }
      }
    }
  };

  // Compare sectors for delta strip
  const compareSectors = compareData ? compareData.sectors : { s1: '30.000', s2: '32.000', s3: '29.000' };

  if (loading && !data) return <LoadingSkeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', overflow: 'hidden', gap: '10px' }}>
      {/* TOP CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
        {/* Title */}
        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text)', marginRight: '8px' }}>
          📡 TELEMETRY
        </div>

        {/* Session selector */}
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          style={{ padding: '5px 10px', fontSize: '12px', minWidth: '110px' }}
        >
          {sessions.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>

        {/* Lap mode */}
        <select
          value={selectedLap}
          onChange={(e) => setSelectedLap(e.target.value)}
          style={{ padding: '5px 10px', fontSize: '12px', minWidth: '110px' }}
        >
          {lapModes.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>

        {/* Driver chips */}
        <div style={{ display: 'flex', gap: '5px', flex: 1, overflowX: 'auto', paddingBottom: '2px' }}>
          {driverList.map(d => (
            <button
              key={d.code}
              onClick={() => setSelectedDriver(d.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 12px',
                background: selectedDriver === d.code ? 'rgba(232,0,45,0.1)' : 'var(--panel)',
                border: selectedDriver === d.code ? '1px solid var(--red)' : '1px solid var(--border)',
                color: selectedDriver === d.code ? '#fff' : 'var(--muted2)',
                fontFamily: 'Orbitron', fontSize: '9px', fontWeight: 700,
                borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              {d.code}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      {data && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDriver + selectedSession + selectedLap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid', gridTemplateColumns: '360px 1fr',
              gap: '12px', flex: 1, overflow: 'hidden', minHeight: 0
            }}
          >
            {/* =========== LEFT PANEL =========== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto', paddingRight: '4px' }}>
              {/* Session Summary */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header">TELEMETRY SESSION</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: data.teamColor || driverList.find(d => d.code === selectedDriver)?.color
                  }} />
                  <span style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                    {data.driverCode}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--muted2)', fontFamily: 'Barlow Condensed' }}>
                    {data.team}
                  </span>
                </div>
                <StatRow label="Session" value={data.session} />
                <StatRow label="Lap" value={data.lapLabel} />
                <StatRow label="Best Lap" value={data.bestLap} color="var(--yellow)" />
                <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                <StatRow label="Sector 1" value={data.sectors.s1} />
                <StatRow label="Sector 2" value={data.sectors.s2} />
                <StatRow label="Sector 3" value={data.sectors.s3} />
                <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                <StatRow label="Tyre Compound" value={data.tyreCompound} />
                <StatRow label="Track Temp" value={data.temps.track} unit="°C" />
                <StatRow label="Air Temp" value={data.temps.air} unit="°C" />
                <StatRow label="Fuel Load" value={data.fuelLoad} />
                <StatRow label="ERS Deploy" value={data.ers} unit="%" color="var(--cyan)" />
                <StatRow label="DRS Count" value={data.drsCount} />
              </div>

              {/* Session Status Card */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header">SESSION STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <StatusBadge status={data.status} />
                  <span style={{
                    fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700,
                    color: data.deltaToTeammate?.startsWith('-') ? 'var(--green)' : 'var(--red)'
                  }}>
                    {data.deltaToTeammate}
                    <span style={{ fontSize: '8px', color: 'var(--muted)', marginLeft: '3px' }}>vs teammate</span>
                  </span>
                </div>
              </div>

              {/* Performance Snapshot */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header">PERFORMANCE SNAPSHOT</div>
                <StatRow label="Top Speed" value={data.topSpeed} unit="km/h" color="var(--green)" />
                <StatRow label="Min Corner Speed" value={data.minSpeed} unit="km/h" color="var(--red)" />
                <StatRow label="Avg Throttle" value={data.avgThrottle} unit="%" />
                <StatRow label="Avg Brake Pressure" value={data.avgBrake} unit="%" />
                <StatRow label="Corner Entry" value={data.cornerEntrySpeed} unit="km/h" />
                <StatRow label="Corner Exit" value={data.cornerExitSpeed} unit="km/h" />
              </div>
            </div>

            {/* =========== RIGHT PANEL =========== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto', paddingRight: '4px' }}>
              {/* Speed Trace */}
              <div className="panel" style={{ padding: '14px', minHeight: '220px' }}>
                <div className="section-header">SPEED TRACE</div>
                <div style={{ height: 'calc(100% - 28px)' }}>
                  {speedChartData && <Line data={speedChartData} options={speedChartOptions} key={selectedDriver + '-speed'} />}
                </div>
              </div>

              {/* Throttle / Brake */}
              <div className="panel" style={{ padding: '14px', minHeight: '180px' }}>
                <div className="section-header">THROTTLE / BRAKE OVERLAY</div>
                <div style={{ height: 'calc(100% - 28px)' }}>
                  {throttleBrakeData && <Line data={throttleBrakeData} options={throttleOptions} key={selectedDriver + '-tb'} />}
                </div>
              </div>

              {/* Sector Delta Strip */}
              <SectorDeltaStrip sectors={data.sectors} compareS={compareSectors} />

              {/* Timing Table */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header">LAP TIMING</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr>
                        {['LAP', 'S1', 'S2', 'S3', 'TRAP', 'DELTA', 'TYRE'].map(h => (
                          <th key={h} style={{
                            padding: '6px 8px', textAlign: 'left', fontFamily: 'Orbitron', fontSize: '8px',
                            fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px',
                            borderBottom: '1px solid var(--border)'
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.lapTable.map((row, idx) => {
                        const isBest = row.delta === '+0.000';
                        // Find fastest sectors
                        const allS1 = data.lapTable.map(r => parseFloat(r.s1));
                        const allS2 = data.lapTable.map(r => parseFloat(r.s2));
                        const allS3 = data.lapTable.map(r => parseFloat(r.s3));
                        const fastestS1 = Math.min(...allS1);
                        const fastestS2 = Math.min(...allS2);
                        const fastestS3 = Math.min(...allS3);

                        return (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            style={{
                              borderLeft: isBest ? '2px solid var(--red)' : '2px solid transparent',
                              background: isBest ? 'rgba(232,0,45,0.04)' : 'transparent'
                            }}
                          >
                            <td style={{ padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', fontWeight: 700, color: 'var(--text)' }}>{row.lap}</td>
                            <td style={{ padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', color: parseFloat(row.s1) === fastestS1 ? 'var(--green)' : 'var(--text)' }}>{row.s1}</td>
                            <td style={{ padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', color: parseFloat(row.s2) === fastestS2 ? 'var(--green)' : 'var(--text)' }}>{row.s2}</td>
                            <td style={{ padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', color: parseFloat(row.s3) === fastestS3 ? 'var(--green)' : 'var(--text)' }}>{row.s3}</td>
                            <td style={{ padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--muted2)' }}>{row.trap}</td>
                            <td style={{
                              padding: '5px 8px', fontFamily: 'Orbitron', fontSize: '10px', fontWeight: 700,
                              color: row.delta.startsWith('+0.000') ? 'var(--yellow)' : row.delta.startsWith('-') ? 'var(--green)' : 'var(--red)'
                            }}>{row.delta}</td>
                            <td style={{ padding: '5px 8px' }}>
                              <span style={{
                                display: 'inline-block', padding: '1px 6px', borderRadius: '3px', fontFamily: 'Orbitron', fontSize: '8px', fontWeight: 700,
                                background: row.tyres === 'S' ? '#E8002D18' : row.tyres === 'M' ? '#FFD70018' : '#fff18',
                                color: row.tyres === 'S' ? 'var(--red)' : row.tyres === 'M' ? 'var(--yellow)' : 'var(--text)',
                                border: `1px solid ${row.tyres === 'S' ? 'var(--red)' : row.tyres === 'M' ? 'var(--yellow)' : 'var(--muted)'}40`
                              }}>{row.tyres}</span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insight Card */}
              <div className="panel" style={{ padding: '14px' }}>
                <div className="section-header">TELEMETRY INSIGHTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.insights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '8px 10px', background: 'var(--panel2)', borderRadius: '4px',
                        borderLeft: '3px solid var(--cyan)'
                      }}
                    >
                      <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: 1 }}>💡</span>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.4, fontFamily: 'Barlow Condensed' }}>
                          {insight}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '3px', fontFamily: 'Barlow Condensed' }}>
                          AI-generated telemetry analysis
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Telemetry;
