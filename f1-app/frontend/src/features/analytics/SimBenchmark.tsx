import { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { circuitsData, tipsData, CircuitData } from '../../data/circuits';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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

const platforms = [
  { code: 'iracing', name: 'iRacing' },
  { code: 'ac', name: 'Assetto Corsa' },
  { code: 'rf2', name: 'rFactor2' },
  { code: 'custom', name: 'Custom' },
];

const skillLevels = [
  { code: 'rookie', name: 'Rookie' },
  { code: 'amateur', name: 'Amateur' },
  { code: 'semipro', name: 'Semi-Pro' },
  { code: 'pro', name: 'Pro' },
];

function parseLapTime(timeStr: string): number {
  const parts = timeStr.split(':');
  return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return mins + ':' + secs.padStart(6, '0');
}

export default function SimBenchmark() {
  const [selectedCircuit, setSelectedCircuit] = useState<string>('bahrain');
  const [userTime, setUserTime] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('iracing');
  const [selectedSkill, setSelectedSkill] = useState<string>('semipro');
  const [showResults, setShowResults] = useState<boolean>(false);

  const circuit = circuitsData[selectedCircuit];

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const baseLap = parseLapTime(circuit.lapRecord);
  const userLapTime = userTime ? parseLapTime(userTime) : baseLap * 1.08;
  const gap = ((userLapTime - baseLap) / baseLap) * 100;

  let score = Math.max(0, Math.min(100, 100 - gap * 10));
  if (gap < 2) score = Math.min(100, score + 10);
  if (gap > 5) score = Math.max(0, score - 10);
  score = Math.round(score);

  const comparisonData = {
    labels: ['Your Time', 'Sim World Record', 'F1 Quali Record', 'F1 Race Pace', 'F1 Race Lap'],
    datasets: [
      {
        data: [
          userLapTime,
          baseLap * 0.97,
          baseLap * 0.99,
          baseLap * 1.05,
          baseLap * 1.02,
        ].map(t => 100 - (t / (baseLap * 1.1)) * 100),
        backgroundColor: [
          chartColors.text,
          chartColors.cyan,
          chartColors.purple,
          chartColors.orange,
          chartColors.red,
        ],
        borderColor: [
          chartColors.text,
          chartColors.cyan,
          chartColors.purple,
          chartColors.orange,
          chartColors.red,
        ],
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        grid: { display: false },
        ticks: { color: chartColors.text, font: { family: 'Barlow Condensed', size: 11 } },
      },
    },
  };

  const s1Time = userLapTime * 0.32 + (Math.random() - 0.5) * 2;
  const s2Time = userLapTime * 0.33 + (Math.random() - 0.5) * 2;
  const s3Time = userLapTime * 0.35 + (Math.random() - 0.5) * 2;
  const f1S1 = s1Time * 0.96;
  const f1S2 = s2Time * 0.95;
  const f1S3 = s3Time * 0.97;

  const sectors = [
    { label: 'S1', user: s1Time, f1: f1S1 },
    { label: 'S2', user: s2Time, f1: f1S2 },
    { label: 'S3', user: s3Time, f1: f1S3 },
  ];

  const getSectorColor = (delta: number) => {
    if (delta < 0.1) return 'bg-green-500';
    if (delta < 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ringData = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score > 70 ? chartColors.green : score > 40 ? chartColors.yellow : chartColors.red,
          chartColors.panel,
        ],
        borderWidth: 0,
      },
    ],
  };

  const ringOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    cutout: '80%',
  };

  const tips = tipsData[selectedCircuit] || ['Focus on consistency', 'Study racing lines', 'Practice race starts'];

  return (
    <div className="h-full flex gap-4">
      {/* Left Input Panel */}
      <div className="w-72 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-5 flex flex-col gap-5">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">
            Select Circuit
          </label>
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-white font-f1 text-sm focus:outline-none focus:border-f1-red"
          >
            {Object.values(circuitsData).map((c: CircuitData) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">
            Your Lap Time
          </label>
          <input
            type="text"
            value={userTime}
            onChange={(e) => setUserTime(e.target.value)}
            placeholder="1:32.456"
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-white font-f1 text-sm focus:outline-none focus:border-f1-red placeholder-gray-600"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">
            Sim Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => (
              <button
                key={p.code}
                onClick={() => setSelectedPlatform(p.code)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedPlatform === p.code
                    ? 'bg-f1-red text-white'
                    : 'bg-gray-950 border border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">
            Driver Skill Level
          </label>
          <div className="space-y-2">
            {skillLevels.map((s) => (
              <button
                key={s.code}
                onClick={() => setSelectedSkill(s.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedSkill === s.code
                    ? 'bg-f1-red/10 border border-f1-red text-white'
                    : 'bg-gray-950 border border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedSkill === s.code ? 'border-f1-red' : 'border-gray-600'
                  }`}
                >
                  {selectedSkill === s.code && <div className="w-2 h-2 rounded-full bg-f1-red" />}
                </div>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          className="mt-auto bg-f1-red hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-f1-red/20"
        >
          Analyze Lap
        </button>
      </div>

      {/* Right Results Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {!showResults ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="font-f1 text-4xl text-gray-600 mb-4">ANALYZE YOUR LAP</div>
              <div className="text-gray-500">Select a circuit and enter your lap time to see detailed analysis</div>
            </div>
          </div>
        ) : (
          <>
            {/* Lap Comparison */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
                Your Lap vs Grid
              </h3>
              <div className="h-40">
                <Bar data={comparisonData} options={barOptions} />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-500 px-1">
                <span>F1 Race: {formatTime(baseLap * 1.02)}</span>
                <span>Your: {formatTime(userLapTime)}</span>
                <span
                  className={`font-semibold ${
                    gap < 2 ? 'text-green-500' : gap < 5 ? 'text-yellow-500' : 'text-red-500'
                  }`}
                >
                  {gap < 2 ? 'Within 2%' : gap < 5 ? '2-5%' : '>5%'} gap
                </span>
              </div>
            </div>

            {/* Sector Breakdown */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
                Sector Breakdown
              </h3>
              <div className="space-y-3">
                {sectors.map((s) => {
                  const delta = s.user - s.f1;
                  const pct = Math.min((s.user / Math.max(s.user, s.f1)) * 100, 100);
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="font-f1 font-bold text-sm text-gray-400 w-8">{s.label}</span>
                      <div className="flex-1 h-6 bg-gray-950 rounded relative overflow-hidden">
                        <div
                          className={`h-full ${getSectorColor(delta)} rounded transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-f1 text-sm text-white w-20 text-right">
                        {formatTime(s.user).slice(1)}
                      </span>
                      <span
                        className={`font-f1 text-xs w-16 text-right ${
                          delta > 0 ? 'text-red-500' : 'text-green-500'
                        }`}
                      >
                        {delta > 0 ? '+' : ''}{delta.toFixed(3)}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Ring */}
            <div className="bg-gray-900/80 backdrop-blur-sm border-l-4 border-f1-red rounded-lg p-6">
              <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-4 text-center">
                Performance Rating
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <Doughnut data={ringData} options={ringOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-f1 font-bold text-5xl text-white">{score}</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider mt-1">
                      {selectedSkill}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {['Pace', 'Braking', 'Cornering'].map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gap < 2
                          ? 'bg-green-500/20 text-green-500'
                          : gap < 5
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <h3 className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
                Improvement Tips
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-f1-red mt-0.5">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
