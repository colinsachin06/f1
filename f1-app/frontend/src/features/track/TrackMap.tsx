import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';

export default function TrackMap({ sessionKey }: { sessionKey: number }) {
  const { drivers, selectedDriver, setSelectedDriver } = useRaceStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: location, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['location', sessionKey],
    queryFn: () => raceApi.getLocation(sessionKey),
    refetchInterval: 5000,
  });

  const { data: latestPositions } = useQuery({
    queryKey: ['positions', sessionKey],
    queryFn: () => raceApi.getPositions(sessionKey),
    refetchInterval: 5000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !location || location.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 50;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const minX = Math.min(...location.map((l) => l.x));
    const maxX = Math.max(...location.map((l) => l.x));
    const minY = Math.min(...location.map((l) => l.y));
    const maxY = Math.max(...location.map((l) => l.y));

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const scaleX = (width - padding * 2) / rangeX;
    const scaleY = (height - padding * 2) / rangeY;
    const mapScale = Math.min(scaleX, scaleY);

    const offsetX = padding + (width - padding * 2 - rangeX * mapScale) / 2;
    const offsetY = padding + (height - padding * 2 - rangeY * mapScale) / 2;

    const toScreen = (x: number, y: number) => ({
      x: (x - minX) * mapScale + offsetX,
      y: height - ((y - minY) * mapScale + offsetY),
    });

    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const sortedLocation = [...location].sort((a, b) => a.date.localeCompare(b.date));

    ctx.beginPath();
    sortedLocation.forEach((loc, i) => {
      const point = toScreen(loc.x, loc.y);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 28;
    ctx.stroke();

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 24;
    ctx.stroke();

    const driversMap = new Map<number, { x: number; y: number }>();
    sortedLocation.forEach((loc) => {
      driversMap.set(loc.driver_number, { x: loc.x, y: loc.y });
    });

    driversMap.forEach((pos, driverNumber) => {
      const screenPos = toScreen(pos.x, pos.y);
      const driver = drivers.find((d) => d.driver_number === driverNumber);
      const isSelected = selectedDriver === driverNumber;

      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, isSelected ? 12 : 10, 0, Math.PI * 2);
      ctx.fillStyle = driver?.team_colour || '#888888';
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Orbitron';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(driver?.name_acronym || String(driverNumber), screenPos.x, screenPos.y);
    });

  }, [location, drivers, selectedDriver]);

  if (isLoading) return <LoadingSpinner />;

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-9">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Track Map</CardTitle>
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={isFetching}
            >
              <RefreshCw className={clsx('w-4 h-4', isFetching && 'animate-spin')} />
            </button>
          </CardHeader>

          <div className="relative bg-gray-950 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>DRS Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-white" />
              <span>Start/Finish</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Driver Positions</CardTitle>
          </CardHeader>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {latestPositions?.slice(0, 20).map((pos: any) => {
              const driver = getDriver(pos.driver_number);
              const isSelected = selectedDriver === pos.driver_number;

              return (
                <div
                  key={pos.driver_number}
                  onClick={() => setSelectedDriver(pos.driver_number)}
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded cursor-pointer transition-colors',
                    isSelected ? 'bg-gray-700' : 'hover:bg-gray-800'
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: driver?.team_colour || '#888888' }}
                  />
                  <span className="font-medium">{pos.driver_number}</span>
                  <span className="text-sm text-gray-400">{driver?.name_acronym}</span>
                  <span className="ml-auto font-bold">P{pos.position}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
