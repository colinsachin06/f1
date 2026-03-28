import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner, Badge } from '../../components/ui';
import clsx from 'clsx';

const TYRE_COLORS: Record<string, string> = {
  SOFT: '#FF3333',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#43B02A',
  WET: '#0067AD',
};

interface WhatIfState {
  driverNumber: number;
  pitLap: number;
  compound: string;
  safetyCar: boolean;
}

export default function WhatIf({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();
  const [whatIf, setWhatIf] = useState<WhatIfState>({
    driverNumber: drivers[0]?.driver_number || 1,
    pitLap: 20,
    compound: 'MEDIUM',
    safetyCar: false,
  });

  const { data: stints } = useQuery({
    queryKey: ['stints', sessionKey],
    queryFn: () => raceApi.getStints(sessionKey),
  });

  const { data: laps } = useQuery({
    queryKey: ['laps', sessionKey, whatIf.driverNumber],
    queryFn: () => raceApi.getLaps(sessionKey, whatIf.driverNumber),
  });

  const getDriverStints = (driverNumber: number) => {
    return stints?.filter((s) => s.driver_number === driverNumber) || [];
  };

  const calculatePositionGain = () => {
    const baseGain = Math.random() * 5 + 1;
    const safetyCarBonus = whatIf.safetyCar ? 2 : 0;
    return Math.round(baseGain + safetyCarBonus);
  };

  const calculateTimeLoss = () => {
    const pitTime = 22;
    const trafficLoss = Math.random() * 3;
    const safetyCarBonus = whatIf.safetyCar ? -5 : 0;
    return (pitTime + trafficLoss + safetyCarBonus).toFixed(1);
  };

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (!stints || !laps) return <LoadingSpinner />;

  const currentStints = getDriverStints(whatIf.driverNumber);
  const totalLaps = laps.length > 0 ? Math.max(...laps.map((l) => l.lap_number)) : 57;
  const avgLapTime = laps.length > 0 
    ? (laps.reduce((sum, l) => sum + l.lap_duration, 0) / laps.length).toFixed(3)
    : '0.000';

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>What-If Simulator</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Driver</label>
              <select
                value={whatIf.driverNumber}
                onChange={(e) => setWhatIf({ ...whatIf, driverNumber: parseInt(e.target.value) })}
                className="input w-full"
              >
                {drivers.slice(0, 10).map((driver) => (
                  <option key={driver.driver_number} value={driver.driver_number}>
                    {driver.name_acronym} - {driver.team_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Pit Stop Lap: {whatIf.pitLap}
              </label>
              <input
                type="range"
                min="1"
                max={totalLaps}
                value={whatIf.pitLap}
                onChange={(e) => setWhatIf({ ...whatIf, pitLap: parseInt(e.target.value) })}
                className="w-full accent-f1-red"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lap 1</span>
                <span>Lap {totalLaps}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Tyre Compound</label>
              <div className="grid grid-cols-3 gap-2">
                {['SOFT', 'MEDIUM', 'HARD'].map((compound) => (
                  <button
                    key={compound}
                    onClick={() => setWhatIf({ ...whatIf, compound })}
                    className={clsx(
                      'p-2 rounded-lg border-2 transition-all',
                      whatIf.compound === compound
                        ? 'border-f1-red scale-105'
                        : 'border-gray-700 hover:border-gray-500'
                    )}
                    style={{
                      backgroundColor: whatIf.compound === compound 
                        ? `${TYRE_COLORS[compound]}33` 
                        : 'transparent',
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: TYRE_COLORS[compound] }}
                    />
                    <span className="text-xs">{compound}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatIf.safetyCar}
                  onChange={(e) => setWhatIf({ ...whatIf, safetyCar: e.target.checked })}
                  className="w-4 h-4 accent-f1-red"
                />
                <span className="text-sm">Safety Car in pit window</span>
              </label>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Analysis</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-f1 font-bold text-yellow-500">
                +{calculatePositionGain()}
              </div>
              <div className="text-sm text-gray-400 mt-1">Positions Gained</div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-f1 font-bold text-red-500">
                {calculateTimeLoss()}s
              </div>
              <div className="text-sm text-gray-400 mt-1">Time Loss</div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-f1 font-bold text-blue-500">
                ~{Math.round(totalLaps - whatIf.pitLap + (whatIf.pitLap > totalLaps / 2 ? 5 : 8))}
              </div>
              <div className="text-sm text-gray-400 mt-1">Laps on New Tyre</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Current Strategy: {getDriver(whatIf.driverNumber)?.name_acronym}</h4>
            <div className="flex gap-2">
              {currentStints.map((stint, i) => (
                <Badge
                  key={i}
                  variant={stint.compound === 'SOFT' ? 'red' : stint.compound === 'MEDIUM' ? 'yellow' : 'blue'}
                >
                  {stint.compound} ({stint.lap_start}-{stint.lap_end})
                </Badge>
              ))}
              <Badge variant="green">
                {whatIf.compound} (Lap {whatIf.pitLap})
              </Badge>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Strategy Notes</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Average lap time: {avgLapTime}s</li>
              <li>• Undercut potential: High (5-8 tenths per lap on fresher tyres)</li>
              <li>• {whatIf.safetyCar ? 'Safety Car reduces time loss significantly' : 'Normal pit stop costs ~22 seconds'}</li>
              <li>• {whatIf.compound === 'SOFT' ? 'Soft tyre: Maximum performance, lowest durability' : 
                   whatIf.compound === 'MEDIUM' ? 'Medium tyre: Balanced performance and durability' : 
                   'Hard tyre: Maximum durability, lowest performance'}</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
