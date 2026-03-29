import { useState } from 'react';
import { Line, Radar, Bubble } from 'react-chartjs-2';
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
  RadialLinearScale,
} from 'chart.js';
import { constructorsData, raceNames, ConstructorData } from '../../data/constructors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
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

const teamButtons = [
  { code: 'redbull', name: 'Red Bull', color: '#1e41ff' },
  { code: 'ferrari', name: 'Ferrari', color: '#dc0000' },
  { code: 'mercedes', name: 'Mercedes', color: '#00d2be' },
  { code: 'mclaren', name: 'McLaren', color: '#ff8000' },
  { code: 'aston', name: 'Aston Martin', color: '#00584f' },
  { code: 'williams', name: 'Williams', color: '#64c4ff' },
];

export default function ConstructorTracker() {
  const [selectedTeam, setSelectedTeam] = useState<string>('redbull');

  const constructor = constructorsData[selectedTeam];

  const racePointsData = {
    labels: raceNames,
    datasets: Object.values(constructorsData).map((c: ConstructorData) => ({
      label: c.name,
      data: c.points,
      backgroundColor: c.color + '30',
      borderColor: c.color,
      fill: true,
      tension: 0.4,
    })),
  };

  const racePointsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200 },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: chartColors.text, font: { family: 'Barlow Condensed', size: 11 }, padding: 15 } },
      tooltip: {
        backgroundColor: chartColors.panel,
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
        borderColor: chartColors.border,
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: chartColors.border }, ticks: { color: chartColors.muted, maxRotation: 45 } },
      y: { grid: { color: chartColors.border }, ticks: { color: chartColors.muted } },
    },
  };

  const engineData = {
    labels: ['Power', 'Fuel Efficiency', 'Reliability', 'Heat Mgmt', 'Driveability', 'Recovery'],
    datasets: [
      {
        label: 'Red Bull',
        data: [9, 8, 9, 8, 9, 8],
        backgroundColor: '#1e41ff30',
        borderColor: '#1e41ff',
        borderWidth: 2,
        pointBackgroundColor: '#1e41ff',
      },
      {
        label: 'Mercedes',
        data: [8, 9, 8, 9, 8, 9],
        backgroundColor: '#00d2be30',
        borderColor: '#00d2be',
        borderWidth: 2,
        pointBackgroundColor: '#00d2be',
      },
      {
        label: 'Ferrari',
        data: [9, 7, 8, 7, 8, 7],
        backgroundColor: '#dc000030',
        borderColor: '#dc0000',
        borderWidth: 2,
        pointBackgroundColor: '#dc0000',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        grid: { color: chartColors.border },
        angleLines: { color: chartColors.border },
        pointLabels: { color: chartColors.muted, font: { size: 9 } },
        ticks: { display: false },
      },
    },
  };

  const upgradeData = {
    datasets: [
      {
        label: 'Red Bull',
        data: [
          { x: 3, y: -0.4, r: 8 },
          { x: 6, y: -0.8, r: 12 },
          { x: 10, y: -0.3, r: 6 },
          { x: 16, y: -0.5, r: 10 },
        ],
        backgroundColor: '#1e41ff',
        borderColor: '#1e41ff',
      },
      {
        label: 'Ferrari',
        data: [
          { x: 5, y: -0.3, r: 10 },
          { x: 11, y: -0.6, r: 14 },
        ],
        backgroundColor: '#dc0000',
        borderColor: '#dc0000',
      },
      {
        label: 'Mercedes',
        data: [
          { x: 4, y: -0.2, r: 8 },
          { x: 14, y: -0.7, r: 12 },
        ],
        backgroundColor: '#00d2be',
        borderColor: '#00d2be',
      },
    ],
  };

  const bubbleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.raw.y.toFixed(2)}s improvement`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 22,
        grid: { color: chartColors.border },
        ticks: { color: chartColors.muted, stepSize: 2 },
        title: { display: true, text: 'Race', color: chartColors.muted },
      },
      y: {
        min: -1,
        max: 0.2,
        grid: { color: chartColors.border },
        ticks: { color: chartColors.muted, callback: (v: number) => v + 's' },
        title: { display: true, text: 'Lap Time Delta', color: chartColors.muted },
      },
    },
  };

  const kpi = constructor.kpi;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Constructor Buttons */}
      <div className="flex gap-2 flex-wrap">
        {teamButtons.map((team) => (
          <button
            key={team.code}
            onClick={() => setSelectedTeam(team.code)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedTeam === team.code
                ? 'ring-2 ring-white shadow-lg'
                : 'opacity-80 hover:opacity-100 hover:scale-105'
            }`}
            style={{ backgroundColor: team.color, color: team.code === 'mercedes' || team.code === 'williams' ? '#000' : '#fff' }}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="flex-1 grid grid-cols-5 gap-4 min-h-0">
        {/* Race Points Chart */}
        <div className="col-span-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
            Race-by-Race Points — 2024 Season
          </h3>
          <div className="h-[calc(100%-2rem)]">
            <Line data={racePointsData} options={racePointsOptions} />
          </div>
        </div>

        {/* Side Charts */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Engine Mode Radar */}
          <div className="flex-1 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[160px]">
            <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
              Engine Mode Impact
            </h3>
            <div className="h-[calc(100%-2rem)]">
              <Radar data={engineData} options={radarOptions} />
            </div>
          </div>

          {/* Upgrade Bubble Chart */}
          <div className="flex-1 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[160px]">
            <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
              Aero Upgrade Timeline
            </h3>
            <div className="h-[calc(100%-2rem)]">
              <Bubble data={upgradeData} options={bubbleOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
          <div className="font-f1 font-bold text-2xl text-yellow-500">P{kpi.pos}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Constructors Pos</div>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
          <div className="font-f1 font-bold text-2xl text-white">{kpi.points}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Total Points</div>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
          <div className="font-f1 font-bold text-2xl text-yellow-500">{kpi.wins}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Wins</div>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
          <div className="font-f1 font-bold text-2xl text-green-500">{kpi.reliability}%</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Reliability</div>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
          <div className="font-f1 font-bold text-2xl text-white">{kpi.avgPoints}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Avg Points/Race</div>
        </div>
      </div>
    </div>
  );
}
