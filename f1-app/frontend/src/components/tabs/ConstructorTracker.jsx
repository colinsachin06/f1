import React, { useState, useEffect } from 'react';
import { Line, Radar, Scatter } from 'react-chartjs-2';
import StatCard from '../shared/StatCard';

function ConstructorTracker({ constructors, loading, error }) {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  useEffect(() => {
    if (constructors && constructors.length > 0 && selectedTeams.length === 0) {
      setSelectedTeams(constructors.map(c => c.id));
    }
  }, [constructors, selectedTeams]);

  const toggleTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      if (selectedTeams.length > 1) {
        setSelectedTeams(selectedTeams.filter(id => id !== teamId));
      }
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}><div className="skeleton" style={{ height: '600px' }} /></div>;
  }

  if (error) return <div className="error-card">Failed to load data — retrying...</div>;
  if (!constructors) return null;

  const raceLabels = constructors[0]?.race2024.map(r => r.race) || [];
  
  const cumulativePoints = (raceData) => {
    let total = 0;
    return raceData.map(r => {
      total += r.points;
      return total;
    });
  };

  const racePointsData = {
    labels: raceLabels,
    datasets: constructors
      .filter(c => selectedTeams.includes(c.id))
      .map(c => ({
        label: c.shortName,
        data: cumulativePoints(c.race2024),
        borderColor: c.color,
        backgroundColor: c.color + '20',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5
      }))
  };

  const racePointsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Orbitron', size: 10 },
          boxWidth: 12
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: 'rgba(255,255,255,0.3)', 
          font: { size: 8 },
          maxRotation: 45
        }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      }
    }
  };

  const engineAxes = ['Power', 'Fuel Efficiency', 'Reliability', 'Heat Mgmt', 'Driveability', 'Recovery'];
  const engineKeys = ['power', 'fuelEfficiency', 'reliability', 'heatMgmt', 'driveability', 'recovery'];

  const displayTeams = hoveredTeam 
    ? constructors.filter(c => selectedTeams.includes(c.id) && c.id === hoveredTeam).slice(0, 3)
    : constructors.filter(c => selectedTeams.includes(c.id)).slice(0, 3);

  const radarData = {
    labels: engineAxes,
    datasets: displayTeams.map(c => ({
      label: c.shortName,
      data: engineKeys.map(k => c.engineProfile[k]),
      borderColor: c.color,
      backgroundColor: c.color + '28',
      pointBackgroundColor: c.color,
      pointBorderColor: c.color
    }))
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
        pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 9 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const upgradeData = {
    datasets: constructors
      .filter(c => selectedTeams.includes(c.id))
      .map(c => ({
        label: c.shortName,
        data: c.upgrades.map(u => ({ x: u.race, y: u.lapTimeDelta, name: u.name, complexity: u.complexity })),
        backgroundColor: c.color,
        borderColor: c.color,
        pointRadius: c.upgrades.map(u => u.complexity * 4),
        pointHoverRadius: c.upgrades.map(u => u.complexity * 5)
      }))
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 24,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      },
      y: {
        min: -1,
        max: 0,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: 'rgba(255,255,255,0.3)', 
          font: { size: 10 },
          callback: (value) => value.toFixed(2) + 's'
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${context.dataset.label}: ${point.name} (Race ${point.x}, ${point.y}s)`;
          }
        }
      }
    }
  };

  const firstTeam = constructors.find(c => selectedTeams.includes(c.id));

  return (
    <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'auto' }}>
      {/* Constructor Selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {constructors.map(c => (
          <button
            key={c.id}
            onClick={() => toggleTeam(c.id)}
            onMouseEnter={() => setHoveredTeam(c.id)}
            onMouseLeave={() => setHoveredTeam(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: selectedTeams.includes(c.id) ? c.color + '18' : 'var(--panel)',
              border: `1px solid ${selectedTeams.includes(c.id) ? c.color : 'var(--border)'}`,
              borderLeft: `3px solid ${c.color}`,
              color: c.color,
              fontFamily: 'Orbitron',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
              borderRadius: '4px'
            }}
          >
            {c.shortName}
          </button>
        ))}
      </div>

      {/* Main Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: '16px', flex: 1 }}>
        {/* Left: Race Points Chart */}
        <div className="panel" style={{ padding: '16px' }}>
          <div className="section-header">Constructor Points Progression</div>
          <div style={{ height: 'calc(100% - 30px)' }}>
            <Line data={racePointsData} options={racePointsOptions} />
          </div>
        </div>

        {/* Right: Two stacked charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="panel" style={{ flex: 1, padding: '16px' }}>
            <div className="section-header">Engine Profile</div>
            <div style={{ height: 'calc(100% - 30px)' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          <div className="panel" style={{ flex: 1, padding: '16px' }}>
            <div className="section-header">Upgrade Impact</div>
            <div style={{ height: 'calc(100% - 30px)' }}>
              <Scatter data={upgradeData} options={scatterOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom KPI Cards */}
      {firstTeam && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          <StatCard label="Position" value={`P${firstTeam.kpis.position}`} color="var(--green)" size="sm" />
          <StatCard label="Total Points" value={firstTeam.kpis.points} size="sm" />
          <StatCard label="Race Wins" value={firstTeam.kpis.wins} color="var(--yellow)" size="sm" />
          <StatCard label="Reliability" value={`${firstTeam.kpis.reliabilityPct}%`} color="var(--cyan)" size="sm" />
          <StatCard label="Avg Pts/Race" value={firstTeam.kpis.avgPointsPerRace} size="sm" />
        </div>
      )}
    </div>
  );
}

export default ConstructorTracker;
