import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import StatCard from '../shared/StatCard';

function CareerArc({ drivers, loading, error }) {
  const [selectedDriver, setSelectedDriver] = useState(null);

  React.useEffect(() => {
    if (drivers && drivers.length > 0 && !selectedDriver) {
      setSelectedDriver(drivers.find(d => d.id === 'ver') || drivers[0]);
    }
  }, [drivers, selectedDriver]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '600px' }} />
      </div>
    );
  }

  if (error) {
    return <div className="error-card">Failed to load data — retrying...</div>;
  }

  if (!selectedDriver || !drivers) return null;

  const topDrivers = drivers.slice(0, 5);
  
  const timelineData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: topDrivers.map(driver => ({
      label: driver.code,
      data: driver.pointsTimeline.map(p => p.points),
      borderColor: driver.teamColor,
      backgroundColor: driver.teamColor + '20',
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: driver.id === selectedDriver.id ? 3 : 1.5,
      opacity: driver.id === selectedDriver.id ? 1 : 0.4
    }))
  };

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
          font: { family: 'Orbitron', size: 10 },
          boxWidth: 12,
          padding: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const driver = topDrivers[context.datasetIndex];
            const season = context.label;
            const seasonData = driver.seasonHistory.find(s => s.year === parseInt(season));
            return `${context.raw} pts | P${seasonData?.position || '-'} | ${seasonData?.wins || 0} wins`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      }
    }
  };

  const gridAverage = {
    wins: 8,
    podiums: 25,
    poles: 6,
    fastestLaps: 5,
    dnfs: 18
  };

  const statsData = {
    labels: ['Wins', 'Podiums', 'Poles', 'Fastest Laps', 'DNFs'],
    datasets: [
      {
        label: selectedDriver.code,
        data: [
          selectedDriver.careerStats.wins,
          selectedDriver.careerStats.podiums,
          selectedDriver.careerStats.poles,
          selectedDriver.careerStats.fastestLaps,
          selectedDriver.careerStats.dnfs
        ],
        backgroundColor: [
          '#FFD700',
          '#C0C0C0',
          '#0067FF',
          '#BF00FF',
          '#E8002D'
        ],
        borderRadius: 4
      },
      {
        label: 'Grid Avg',
        data: [gridAverage.wins, gridAverage.podiums, gridAverage.poles, gridAverage.fastestLaps, gridAverage.dnfs],
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 4
      }
    ]
  };

  const statsOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Orbitron', size: 10 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } }
      }
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 200px',
      gap: '16px',
      height: '100%',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* Left Column: Driver Roster */}
      <div className="panel" style={{ overflow: 'auto', padding: '8px' }}>
        <div className="section-header" style={{ padding: '8px 8px 12px' }}>Driver Roster</div>
        {drivers.map(driver => (
          <div
            key={driver.id}
            onClick={() => setSelectedDriver(driver)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              borderLeft: `3px solid ${driver.teamColor}`,
              background: selectedDriver?.id === driver.id ? 'rgba(232,0,45,0.06)' : 'transparent',
              cursor: 'pointer',
              borderRadius: '0 4px 4px 0',
              marginBottom: '4px'
            }}
          >
            <span style={{
              background: driver.teamColor,
              color: '#000',
              fontFamily: 'Orbitron',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '2px'
            }}>
              {driver.number}
            </span>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700 }}>{driver.code}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{driver.name.split(' ')[1]}</div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{driver.team}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Center Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'auto' }}>
        <div className="panel" style={{ flex: 1, padding: '16px', minHeight: '280px' }}>
          <div className="section-header">Championship Points Timeline</div>
          <div style={{ height: 'calc(100% - 30px)' }}>
            <Line data={timelineData} options={timelineOptions} key={selectedDriver.id} />
          </div>
        </div>

        <div className="panel" style={{ flex: 1, padding: '16px', minHeight: '200px' }}>
          <div className="section-header">Career Statistics vs Grid Average</div>
          <div style={{ height: 'calc(100% - 30px)' }}>
            <Bar data={statsData} options={statsOptions} key={`stats-${selectedDriver.id}`} />
          </div>
        </div>

        {/* Career Milestones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          <StatCard label="Races" value={selectedDriver.careerStats.races} size="sm" />
          <StatCard label="Wins" value={selectedDriver.careerStats.wins} color="var(--yellow)" size="sm" />
          <StatCard label="Poles" value={selectedDriver.careerStats.poles} color="var(--blue)" size="sm" />
          <StatCard label="Podiums" value={selectedDriver.careerStats.podiums} color="var(--purple)" size="sm" />
          <StatCard label="Win %" value={`${selectedDriver.careerStats.winPct}%`} size="sm" />
        </div>
      </div>

      {/* Right Column: Season History */}
      <div className="panel" style={{ overflow: 'auto', padding: '12px' }}>
        <div className="section-header">Season History</div>
        {selectedDriver.seasonHistory.map((season, index) => (
          <motion.div
            key={season.year}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              borderBottom: '1px solid var(--border)'
            }}
          >
            <span style={{ 
              fontFamily: 'Orbitron', 
              fontSize: '12px', 
              color: 'var(--yellow)',
              width: '35px'
            }}>
              {season.year}
            </span>
            <div style={{
              width: '10px',
              height: '10px',
              background: season.teamColor,
              borderRadius: '2px'
            }} />
            <span style={{
              background: season.position === 1 ? 'var(--yellow)' : 
                         season.position === 2 ? 'silver' : 
                         season.position === 3 ? '#CD7F32' : 'var(--panel2)',
              color: season.position <= 3 ? '#000' : 'var(--text)',
              fontFamily: 'Orbitron',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '2px'
            }}>
              P{season.position}
            </span>
            <span style={{
              fontFamily: 'Orbitron',
              fontSize: '14px',
              fontWeight: 700,
              marginLeft: 'auto'
            }}>
              {season.points}
            </span>
            {season.wins > 0 && (
              <span style={{ fontSize: '12px' }}>🏆{season.wins}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CareerArc;
