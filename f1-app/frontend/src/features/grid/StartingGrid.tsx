import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner, Badge } from '../../components/ui';
import { Grid3x3 } from 'lucide-react';
import clsx from 'clsx';

export default function StartingGrid({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();

  const { data: grid, isLoading } = useQuery({
    queryKey: ['startingGrid', sessionKey],
    queryFn: () => raceApi.getStartingGrid(sessionKey),
  });

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (isLoading) return <LoadingSpinner />;

  if (!grid || grid.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Starting Grid</CardTitle>
        </CardHeader>
        <div className="text-center py-8 text-gray-400">
          Starting grid not available for this session
        </div>
      </Card>
    );
  }

  const sortedGrid = [...grid].sort((a: any, b: any) => a.position - b.position);

  const row1 = sortedGrid.filter((g: any) => g.position <= 2);
  const row2 = sortedGrid.filter((g: any) => g.position > 2 && g.position <= 4);
  const row3 = sortedGrid.filter((g: any) => g.position > 4 && g.position <= 6);
  const row4 = sortedGrid.filter((g: any) => g.position > 6 && g.position <= 8);
  const row5 = sortedGrid.filter((g: any) => g.position > 8 && g.position <= 10);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-white" />
          Starting Grid
        </CardTitle>
        <Badge variant="blue">{sortedGrid.length} cars</Badge>
      </CardHeader>

      <div className="space-y-3">
        <GridRow drivers={row1} getDriver={getDriver} />
        <GridRow drivers={row2} getDriver={getDriver} />
        <GridRow drivers={row3} getDriver={getDriver} />
        <GridRow drivers={row4} getDriver={getDriver} />
        <GridRow drivers={row5} getDriver={getDriver} />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-medium mb-3">Qualifying Times</h4>
        <div className="space-y-1">
          {sortedGrid.slice(0, 10).map((g: any) => {
            const driver = getDriver(g.driver_number);
            return (
              <div
                key={g.driver_number}
                className="flex items-center justify-between p-2 bg-gray-800/30 rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-sm">{g.position}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: driver?.team_colour || '#888' }}
                  />
                  <span className="text-sm">{driver?.name_acronym || g.driver_number}</span>
                </div>
                <span className="font-mono text-sm text-gray-300">
                  {g.lap_duration?.toFixed(3)}s
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function GridRow({ drivers, getDriver }: { drivers: any[]; getDriver: (n: number) => any }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="flex gap-4 mx-auto">
          {drivers.map((g: any) => {
            const driver = getDriver(g.driver_number);
            return (
              <div
                key={g.driver_number}
                className={clsx(
                  'w-32 p-3 rounded-lg text-center',
                  g.position === 1 && 'bg-yellow-900/30 border-2 border-yellow-500',
                  g.position === 2 && 'bg-gray-600/30 border border-gray-500',
                  g.position === 3 && 'bg-amber-800/30 border border-amber-600',
                  g.position > 3 && 'bg-gray-800/50 border border-gray-700'
                )}
              >
                <div className={clsx(
                  'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg',
                  g.position === 1 && 'bg-yellow-500 text-black',
                  g.position === 2 && 'bg-gray-400 text-black',
                  g.position === 3 && 'bg-amber-700 text-white',
                  g.position > 3 && 'bg-gray-700 text-gray-300'
                )}>
                  {g.position}
                </div>
                <div
                  className="w-full h-12 rounded mb-2 flex items-end justify-center pb-1"
                  style={{ backgroundColor: `${driver?.team_colour}33` }}
                >
                  <span className="font-bold text-sm">{driver?.name_acronym || g.driver_number}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {driver?.team_name?.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
