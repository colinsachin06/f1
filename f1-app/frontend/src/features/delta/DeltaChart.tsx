import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';
import clsx from 'clsx';

export default function DeltaChart({ sessionKey }: { sessionKey: number }) {
  const { drivers, selectedDriver, setSelectedDriver } = useRaceStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: laps, isLoading } = useQuery({
    queryKey: ['laps', sessionKey, selectedDriver],
    queryFn: () => raceApi.getLaps(sessionKey, selectedDriver || undefined),
    enabled: !!sessionKey,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !laps || laps.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 30, right: 80, bottom: 50, left: 60 };

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(padding.left, padding.top, width - padding.left - padding.right, height - padding.top - padding.bottom);

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const y = padding.top + ((height - padding.top - padding.bottom) / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const lapTimes = laps.map((l) => l.lap_duration);
    const bestTime = Math.min(...lapTimes);
    const maxDelta = Math.max(...lapTimes.map((t) => t - bestTime), 2);

    const getY = (delta: number) => {
      return padding.top + ((maxDelta - delta) / maxDelta) * (height - padding.top - padding.bottom);
    };

    const getX = (lapNumber: number) => {
      return padding.left + ((lapNumber - 1) / (laps.length - 1)) * (width - padding.left - padding.right);
    };

    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, getY(0));
    ctx.lineTo(width - padding.right, getY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    const driver = drivers.find((d) => d.driver_number === selectedDriver);
    ctx.strokeStyle = driver?.team_colour || '#FF4444';
    ctx.lineWidth = 2;

    ctx.beginPath();
    laps.forEach((lap, i) => {
      const delta = lap.lap_duration - bestTime;
      const x = getX(lap.lap_number);
      const y = getY(delta);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.fillStyle = driver?.team_colour || '#FF4444';
    laps.forEach((lap) => {
      const delta = lap.lap_duration - bestTime;
      const x = getX(lap.lap_number);
      const y = getY(delta);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#888888';
    ctx.font = '10px Barlow Condensed';
    ctx.textAlign = 'center';

    const lapNumbersToShow = laps.filter((_, i) => i % 5 === 0 || i === laps.length - 1);
    lapNumbersToShow.forEach((lap) => {
      const x = getX(lap.lap_number);
      ctx.fillText(String(lap.lap_number), x, height - padding.bottom + 20);
    });

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FF4444';
    const deltaValues = [0, maxDelta / 2, maxDelta];
    deltaValues.forEach((delta) => {
      const y = getY(delta);
      ctx.fillText(`+${delta.toFixed(2)}s`, width - padding.right + 70, y + 4);
    });

    ctx.fillStyle = '#888888';
    ctx.font = '12px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText(`${driver?.name_acronym || 'Driver'} Delta`, padding.left, padding.top - 10);

  }, [laps, drivers, selectedDriver]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lap Delta Chart</CardTitle>
        </CardHeader>

        <div className="bg-gray-950 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={900}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Driver to Compare</CardTitle>
        </CardHeader>

        <div className="grid grid-cols-5 gap-2">
          {drivers.slice(0, 10).map((driver) => (
            <button
              key={driver.driver_number}
              onClick={() => setSelectedDriver(driver.driver_number)}
              className={clsx(
                'flex items-center gap-2 p-2 rounded-lg transition-all',
                selectedDriver === driver.driver_number
                  ? 'ring-2 ring-f1-red bg-gray-800'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: driver.team_colour }}
              />
              <span className="text-sm font-medium">{driver.name_acronym}</span>
            </button>
          ))}
        </div>
      </Card>

      {laps && laps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Laps</CardTitle>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2 px-3">Lap</th>
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">Sector 1</th>
                  <th className="text-left py-2 px-3">Sector 2</th>
                  <th className="text-left py-2 px-3">Sector 3</th>
                  <th className="text-left py-2 px-3">Delta</th>
                </tr>
              </thead>
              <tbody>
                {laps
                  .sort((a, b) => a.lap_duration - b.lap_duration)
                  .slice(0, 5)
                  .map((lap, i) => {
                    const bestTime = Math.min(...laps.map((l) => l.lap_duration));
                    const delta = lap.lap_duration - bestTime;

                    return (
                      <tr key={lap.lap_number} className={clsx(
                        'border-b border-gray-800',
                        i === 0 && 'bg-yellow-900/20'
                      )}>
                        <td className="py-2 px-3 font-medium">
                          {i === 0 && <span className="text-yellow-500 mr-2">★</span>}
                          {lap.lap_number}
                        </td>
                        <td className="py-2 px-3 font-mono">{lap.lap_duration.toFixed(3)}</td>
                        <td className="py-2 px-3 font-mono text-gray-400">{lap.duration_sector_1.toFixed(3)}</td>
                        <td className="py-2 px-3 font-mono text-gray-400">{lap.duration_sector_2.toFixed(3)}</td>
                        <td className="py-2 px-3 font-mono text-gray-400">{lap.duration_sector_3.toFixed(3)}</td>
                        <td className={clsx(
                          'py-2 px-3 font-mono',
                          delta === 0 ? 'text-yellow-400' : 'text-green-400'
                        )}>
                          {delta === 0 ? 'BEST' : `+${delta.toFixed(3)}`}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
