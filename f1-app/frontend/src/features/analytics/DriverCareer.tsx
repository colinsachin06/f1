import { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { driversData, gridAverage, DriverData } from '../../data/drivers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartColors = {
  red: '#E8002D',
  orange: '#FF8000',
  yellow: '#FFD700',
  green: '#39FF14',
  blue: '#0067FF',
  purple: '#BF00FF',
  cyan: '#00CFFF',
  muted: '#4E5266',
  dark: '#09090C',
  panel: '#111318',
  border: '#1C1F28',
  text: '#E0E2EA',
};

const statColors = ['#FFD700', '#C0C0C0', '#0067FF', '#BF00FF', '#E8002D'];

export default function DriverCareer() {
  const [selectedDriver, setSelectedDriver] = useState<string>('VER');
  const pointsChartRef = useRef<any>(null);
  const statsChartRef = useRef<any>(null);

  const driver = driversData[selectedDriver];
  const seasons = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

  const pointsChartData = {
    labels: seasons,
    datasets: Object.values(driversData).map((d: DriverData) => ({
      label: d.code,
      data: d.seasons.map(s => s.points),
      borderColor: d.teamColor,
      backgroundColor: d.teamColor + '20',
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const pointsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: 'easeOutQuart' as const },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: chartColors.text, font: { family: 'Barlow Condensed', size: 12 }, padding: 20 },
      },
      tooltip: {
        backgroundColor: chartColors.panel,
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
        borderColor: chartColors.border,
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: chartColors.border }, ticks: { color: chartColors.muted } },
      y: { grid: { color: chartColors.border }, ticks: { color: chartColors.muted } },
    },
  };

  const statsLabels = ['Wins', 'Podiums', 'Poles', 'Fastest Laps', 'DNFs'];
  
  const statsChartData = {
    labels: statsLabels,
    datasets: [
      {
        label: selectedDriver,
        data: Object.values(driver.stats),
        backgroundColor: statColors,
        borderColor: statColors,
        borderWidth: 1,
      },
      {
        label: 'Grid Average',
        data: Object.values(gridAverage),
        backgroundColor: statColors.map(c => c + '40'),
        borderColor: statColors.map(c => c + '80'),
        borderWidth: 1,
      },
    ],
  };

  const statsChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: chartColors.text, font: { family: 'Barlow Condensed' } } },
    },
    scales: {
      x: { grid: { color: chartColors.border }, ticks: { color: chartColors.muted } },
      y: { grid: { display: false }, ticks: { color: chartColors.text } },
    },
  };

  return (
    <div className="h-full flex gap-4">
      {/* Left Panel - Driver Roster */}
      <div className="w-60 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h3 className="font-f1 font-bold text-sm text-gray-400 uppercase tracking-wider">Driver Roster</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {Object.values(driversData).map((d: DriverData) => (
            <div
              key={d.code}
              onClick={() => setSelectedDriver(d.code)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                selectedDriver === d.code
                  ? 'bg-gray-800 border-l-2 border-f1-red'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <div
                className="w-1 h-8 rounded"
                style={{ backgroundColor: d.teamColor }}
              />
              <div className="w-7 h-7 bg-gray-950 rounded-full flex items-center justify-center font-f1 font-bold text-xs">
                {d.number}
              </div>
              <div>
                <div className="font-semibold text-sm text-white">{d.name.split(' ').pop()}</div>
                <div className="text-xs text-gray-500">{d.nationality}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area - Charts */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Points Timeline Chart */}
        <div className="flex-1 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[280px]">
          <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
            Championship Points Timeline
          </h3>
          <div className="h-[calc(100%-2rem)]">
            <Line ref={pointsChartRef} data={pointsChartData} options={pointsChartOptions} />
          </div>
        </div>

        {/* Stats Chart */}
        <div className="flex-1 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[220px]">
          <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
            Career Statistics
          </h3>
          <div className="h-[calc(100%-2rem)]">
            <Bar ref={statsChartRef} data={statsChartData} options={statsChartOptions} />
          </div>
        </div>

        {/* Milestones Strip */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Races', value: driver.career.races },
            { label: 'Wins', value: driver.career.wins },
            { label: 'Championships', value: driver.career.championships },
            { label: 'Win%', value: driver.career.winPct + '%' },
            { label: 'Avg Finish', value: driver.career.avgFinish },
          ].map((item, i) => (
            <div key={i} className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-center">
              <div className="font-f1 font-bold text-2xl text-white">{item.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Season List */}
      <div className="w-52 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h3 className="font-f1 font-bold text-sm text-gray-400 uppercase tracking-wider">Season History</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {driver.seasons.map((season, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-gray-800/50 transition-colors">
              <span className="font-f1 font-bold text-xs text-gray-400 w-8">{season.year}</span>
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: season.teamColor }}
              />
              <span className={`font-f1 font-bold text-xs px-1.5 py-0.5 rounded ${
                season.pos === 1 ? 'bg-yellow-500 text-black' :
                season.pos === 2 ? 'bg-gray-400 text-black' :
                season.pos === 3 ? 'bg-amber-700 text-white' :
                'bg-gray-800 text-gray-300'
              }`}>
                P{season.pos}
              </span>
              <span className="font-f1 text-xs text-white flex-1 text-right">{season.points}</span>
              {season.wins > 0 && (
                <span className="text-[10px] text-yellow-500 font-semibold">{season.wins}W</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
