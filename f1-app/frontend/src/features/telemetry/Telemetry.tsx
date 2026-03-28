import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';
import clsx from 'clsx';
import { Activity } from 'lucide-react';

const CHART_COLORS = {
  speed: '#FF4444',
  throttle: '#44FF44',
  brake: '#4444FF',
};

export default function Telemetry({ sessionKey }: { sessionKey: number }) {
  const { drivers, selectedDriver, setSelectedDriver } = useRaceStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMetric, setActiveMetric] = useState<'speed' | 'throttle' | 'brake'>('speed');

  const { data: carData, isLoading } = useQuery({
    queryKey: ['telemetry', sessionKey, selectedDriver],
    queryFn: () => raceApi.getTelemetry(sessionKey, selectedDriver || undefined),
    enabled: !!sessionKey,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !carData || carData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 30, right: 50, bottom: 40, left: 60 };

    ctx.clearRect(0, 0, width, height);

    const dataPoints = carData.length;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const metricValues = carData.map((d) => d[activeMetric]);
    const maxValue = Math.max(...metricValues, 100);
    const minValue = activeMetric === 'brake' ? 0 : Math.min(...metricValues, 0);

    const getY = (value: number) => {
      return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    };

    ctx.strokeStyle = CHART_COLORS[activeMetric];
    ctx.lineWidth = 2;
    ctx.beginPath();

    metricValues.forEach((value, i) => {
      const x = padding.left + (i / (dataPoints - 1)) * chartWidth;
      const y = getY(value);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.strokeStyle = CHART_COLORS[activeMetric] + '44';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = CHART_COLORS[activeMetric];
    ctx.font = '12px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText(`${activeMetric.toUpperCase()}: ${metricValues[metricValues.length - 1]?.toFixed(0) || 0}`, padding.left, padding.top - 10);

    ctx.fillStyle = '#888888';
    ctx.font = '10px Barlow Condensed';
    ctx.textAlign = 'right';

    const yLabels = [maxValue, (maxValue + minValue) / 2, minValue];
    yLabels.forEach((label) => {
      const y = getY(label);
      ctx.fillText(label.toFixed(0), width - padding.right + 40, y + 4);
    });

  }, [carData, activeMetric]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Telemetry Analysis</CardTitle>
          <div className="flex gap-2">
            {(['speed', 'throttle', 'brake'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={clsx(
                  'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                  activeMetric === metric
                    ? 'text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
                style={{
                  backgroundColor: activeMetric === metric ? CHART_COLORS[metric] : undefined,
                }}
              >
                {metric}
              </button>
            ))}
          </div>
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
          <CardTitle>Select Driver</CardTitle>
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

      <div className="grid grid-cols-3 gap-4">
        {(['speed', 'throttle', 'brake'] as const).map((metric) => {
          const latestData = carData?.[carData.length - 1] as Record<string, number> | undefined;
          const value = latestData?.[metric];

          return (
            <Card key={metric}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: CHART_COLORS[metric] }} />
                  <span className="font-medium capitalize">{metric}</span>
                </div>
                <span className="font-f1 font-bold text-2xl">
                  {value?.toFixed(0) || 0}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
