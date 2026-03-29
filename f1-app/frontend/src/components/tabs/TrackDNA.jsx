import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';

function TrackDNA({ circuits, loading, error }) {
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  useEffect(() => {
    if (circuits && circuits.length > 0 && !selectedCircuit) {
      setSelectedCircuit(circuits.find(c => c.id === 'bahrain') || circuits[0]);
    }
  }, [circuits, selectedCircuit]);

  if (loading) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  if (error) return <div className="error-card">Failed to load data — retrying...</div>;
  if (!selectedCircuit || !circuits) return null;

  const dnaAxes = ['Downforce', 'Top Speed', 'Traction', 'Braking', 'Cornering', 'Street', 'Overtaking', 'Tyre Wear'];
  const dnaKeys = ['downforce', 'topSpeed', 'traction', 'braking', 'corneringSpeed', 'streetCircuit', 'overtaking', 'tyrewear'];

  const dnaData = {
    labels: dnaAxes,
    datasets: [
      {
        label: 'Red Bull (High Downforce)',
        data: [
          selectedCircuit.dna.downforce + 15,
          selectedCircuit.dna.topSpeed - 10,
          selectedCircuit.dna.traction + 10,
          selectedCircuit.dna.braking,
          selectedCircuit.dna.corneringSpeed,
          selectedCircuit.dna.streetCircuit,
          selectedCircuit.dna.overtaking,
          selectedCircuit.dna.tyrewear
        ],
        borderColor: '#3671C6',
        backgroundColor: '#3671C620',
        pointBackgroundColor: '#3671C6'
      },
      {
        label: 'Ferrari (Top Speed)',
        data: [
          selectedCircuit.dna.downforce - 5,
          selectedCircuit.dna.topSpeed + 15,
          selectedCircuit.dna.traction,
          selectedCircuit.dna.braking + 8,
          selectedCircuit.dna.corneringSpeed,
          selectedCircuit.dna.streetCircuit,
          selectedCircuit.dna.overtaking,
          selectedCircuit.dna.tyrewear
        ],
        borderColor: '#E8002D',
        backgroundColor: '#E8002D20',
        pointBackgroundColor: '#E8002D'
      },
      {
        label: 'Mercedes (Balanced)',
        data: [
          selectedCircuit.dna.downforce + 5,
          selectedCircuit.dna.topSpeed + 5,
          selectedCircuit.dna.traction - 5,
          selectedCircuit.dna.braking + 5,
          selectedCircuit.dna.corneringSpeed,
          selectedCircuit.dna.streetCircuit,
          selectedCircuit.dna.overtaking,
          selectedCircuit.dna.tyrewear
        ],
        borderColor: '#27F4D2',
        backgroundColor: '#27F4D220',
        pointBackgroundColor: '#27F4D2'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        angleLines: { color: 'rgba(255,255,255,0.05)' },
        pointLabels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Orbitron', size: 9 },
          boxWidth: 12
        }
      }
    },
    animation: { duration: 500 }
  };

  const renderTyreCircles = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i <= rating ? 'var(--orange)' : 'var(--border2)'
            }}
          />
        ))}
      </div>
    );
  };

  const getWeatherBadge = (risk) => {
    const colors = { Clear: 'var(--green)', Variable: 'var(--yellow)', High: 'var(--red)' };
    return (
      <span style={{
        background: colors[risk] + '20',
        color: colors[risk],
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontFamily: 'Orbitron',
        fontWeight: 700
      }}>
        {risk}
      </span>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr 280px',
      gap: '16px',
      height: '100%',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* Left Sidebar: Circuit List */}
      <div className="panel" style={{ overflow: 'auto', padding: '8px' }}>
        <div className="section-header" style={{ padding: '8px' }}>Circuits</div>
        {circuits.map(circuit => (
          <div
            key={circuit.id}
            onClick={() => setSelectedCircuit(circuit)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              borderLeft: selectedCircuit?.id === circuit.id ? '3px solid var(--red)' : '3px solid transparent',
              background: selectedCircuit?.id === circuit.id ? 'rgba(232,0,45,0.05)' : 'transparent',
              cursor: 'pointer',
              borderRadius: '0 4px 4px 0'
            }}
          >
            <span style={{ fontSize: '16px' }}>{circuit.flagEmoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '13px' }}>
                {circuit.name.replace(' International Racing Course', '').replace('Autodromo ', '').replace('Circuit de ', '')}
              </div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: 'var(--muted)' }}>
                {circuit.lapRecord}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Center: DNA Radar */}
      <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '24px',
          fontWeight: 900,
          marginBottom: '4px'
        }}>
          {selectedCircuit.name}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
          {selectedCircuit.flagEmoji} {selectedCircuit.country}
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <Radar data={dnaData} options={radarOptions} key={selectedCircuit.id} />
        </div>

        {/* Best Suited Card */}
        <div className="panel" style={{ 
          padding: '12px', 
          marginTop: '12px',
          borderLeft: '3px solid #3671C6' 
        }}>
          <div style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '8px', 
            color: 'var(--muted)', 
            letterSpacing: '1.5px',
            marginBottom: '4px'
          }}>
            OPTIMAL CAR
          </div>
          <div style={{ 
            fontFamily: 'Orbitron', 
            fontSize: '14px', 
            fontWeight: 700, 
            color: '#3671C6',
            marginBottom: '4px'
          }}>
            {selectedCircuit.bestSuitedTeam}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.4 }}>
            {selectedCircuit.bestSuitedReason}
          </div>
        </div>
      </div>

      {/* Right Panel: Stats + Setup */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'auto' }}>
        {/* Circuit Stats */}
        <div className="panel" style={{ padding: '12px' }}>
          <div className="section-header">Track Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>Track Length</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>{selectedCircuit.length} km</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>Number of Turns</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>{selectedCircuit.turns}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>DRS Zones</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>{selectedCircuit.drsZones}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>Avg Speed</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>{selectedCircuit.avgSpeed} km/h</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>Lap Record</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>
                {selectedCircuit.lapRecord} <span style={{ color: 'var(--muted2)', fontSize: '11px' }}>({selectedCircuit.lapRecordHolder}, {selectedCircuit.lapRecordYear})</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Tyre Wear</div>
              {renderTyreCircles(selectedCircuit.tyrewear)}
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Weather Risk</div>
              {getWeatherBadge(selectedCircuit.weatherRisk)}
            </div>
          </div>
        </div>

        {/* Setup Guide */}
        <div className="panel" style={{ padding: '12px', flex: 1 }}>
          <div className="section-header">Car Setup Guide</div>
          {['frontWing', 'rearWing', 'suspension', 'brakeBias'].map(setupKey => (
            <div key={setupKey} style={{ marginBottom: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '10px', 
                color: 'var(--muted)', 
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                <span>{setupKey.replace('Wing', ' Wing').replace('brakeBias', 'Brake Bias')}</span>
                <span style={{ color: 'var(--red)', fontFamily: 'Orbitron' }}>{selectedCircuit.setup[setupKey]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedCircuit.setup[setupKey]}
                readOnly
                style={{
                  width: '100%',
                  accentColor: 'var(--red)',
                  background: 'var(--border2)',
                  height: '6px',
                  borderRadius: '3px',
                  cursor: 'default'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrackDNA;
