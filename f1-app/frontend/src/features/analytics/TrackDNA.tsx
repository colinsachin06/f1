import { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { circuitsData, CircuitData } from '../../data/circuits';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

export default function TrackDNA() {
  const [selectedCircuit, setSelectedCircuit] = useState<string>('bahrain');

  const circuit = circuitsData[selectedCircuit];

  const dnaChartData = {
    labels: circuit.flags,
    datasets: [
      {
        label: 'High Downforce',
        data: [
          circuit.dna.HighDownforce,
          circuit.dna.TopSpeed,
          circuit.dna.Traction,
          circuit.dna.Braking,
          circuit.dna.CorneringSpeed,
          circuit.dna.StreetCircuit,
          circuit.dna.Overtaking,
          circuit.dna.TyreWear,
        ],
        backgroundColor: '#0067FF20',
        borderColor: '#0067FF',
        borderWidth: 2,
        pointBackgroundColor: '#0067FF',
      },
      {
        label: 'Top Speed',
        data: [circuit.carTypes.highDownforce, 10, 5, 6, 6, 2, 5, 4],
        backgroundColor: '#E8002D20',
        borderColor: '#E8002D',
        borderWidth: 2,
        pointBackgroundColor: '#E8002D',
      },
      {
        label: 'Balanced',
        data: [circuit.carTypes.balanced, 7, 6, 7, 7, 4, 6, 5],
        backgroundColor: '#00CFFF20',
        borderColor: '#00CFFF',
        borderWidth: 2,
        pointBackgroundColor: '#00CFFF',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: chartColors.text, font: { family: 'Barlow Condensed', size: 11 } } },
    },
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

  const getTeamColor = (team: string) => {
    if (team.includes('RED')) return '#1e41ff';
    if (team.includes('FERR')) return '#dc0000';
    if (team.includes('MERC')) return '#00d2be';
    if (team.includes('MCLAREN')) return '#ff8000';
    return '#fff';
  };

  return (
    <div className="h-full flex gap-4">
      {/* Left Sidebar - Circuit List */}
      <div className="w-52 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h3 className="font-f1 font-bold text-sm text-gray-400 uppercase tracking-wider">Circuits</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {Object.values(circuitsData).map((c: CircuitData) => (
            <div
              key={c.code}
              onClick={() => setSelectedCircuit(c.code)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                selectedCircuit === c.code
                  ? 'bg-gray-800 border-l-2 border-f1-red'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <div>
                <div className="font-semibold text-sm text-white">{c.shortName}</div>
                <div className="font-f1 text-[10px] text-gray-500">{c.lapRecord}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* DNA Radar Chart */}
        <div className="flex-1 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[350px]">
          <h3 className="font-f1 font-bold text-2xl text-center text-white mb-2">
            {circuit.shortName.toUpperCase()}
          </h3>
          <div className="h-[calc(100%-3rem)]">
            <Radar data={dnaChartData} options={radarOptions} />
          </div>
        </div>

        {/* Best Suited Card */}
        <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Best Suited Car</div>
          <div
            className="font-f1 font-bold text-xl mt-2"
            style={{ color: getTeamColor(circuit.bestTeam) }}
          >
            {circuit.bestTeam}
          </div>
          <div className="text-sm text-gray-400 mt-2 leading-relaxed">{circuit.bestReason}</div>
        </div>
      </div>

      {/* Right Panel - Stats */}
      <div className="w-72 flex flex-col gap-3 overflow-y-auto">
        {/* Track Length */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Track Length</div>
          <div className="font-f1 font-bold text-xl text-white mt-1">{circuit.length.toFixed(3)} km</div>
        </div>

        {/* Turns & DRS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Turns</div>
            <div className="font-f1 font-bold text-xl text-white mt-1">{circuit.turns}</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">DRS Zones</div>
            <div className="font-f1 font-bold text-xl text-white mt-1">{circuit.drs}</div>
          </div>
        </div>

        {/* Lap Record */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Lap Record</div>
          <div className="font-f1 font-bold text-lg text-white mt-1">{circuit.lapRecord}</div>
          <div className="text-xs text-gray-500 mt-1">
            {circuit.lapRecordHolder} ({circuit.lapRecordYear})
          </div>
        </div>

        {/* Avg Speed */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Speed</div>
          <div className="font-f1 font-bold text-xl text-white mt-1">{circuit.avgSpeed} km/h</div>
        </div>

        {/* Tyre Wear */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Tyre Wear</div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= circuit.tyrewear ? 'bg-f1-red' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Weather Risk */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Weather Risk</div>
          <div
            className={`inline-block px-3 py-1 rounded text-xs font-semibold mt-2 ${
              circuit.weather === 'clear'
                ? 'bg-green-500/20 text-green-500'
                : circuit.weather === 'variable'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-red-500/20 text-red-500'
            }`}
          >
            {circuit.weather === 'clear' ? 'Clear' : circuit.weather === 'variable' ? 'Variable' : 'High'}
          </div>
        </div>

        {/* Setup Guide */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <div className="font-f1 font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
            Car Setup Guide
          </div>
          {(['frontWing', 'rearWing', 'suspension', 'brakeBias'] as const).map((key) => (
            <div key={key} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-f1 text-cyan-400">{circuit.setup[key]}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${circuit.setup[key] * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
