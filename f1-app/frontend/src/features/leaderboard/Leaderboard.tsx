import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, Badge, LoadingSpinner } from '../../components/ui';
import clsx from 'clsx';
import { Circle, RefreshCw } from 'lucide-react';

const TYRE_COLORS: Record<string, string> = {
  SOFT: '#FF3333',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#43B02A',
  WET: '#0067AD',
};

export default function Leaderboard({ sessionKey }: { sessionKey: number }) {
  const { drivers, selectedDriver, setSelectedDriver } = useRaceStore();

  const { data: leaderboard, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['leaderboard', sessionKey],
    queryFn: () => raceApi.getLeaderboard(sessionKey),
    refetchInterval: 10000,
  });

  const { data: stints } = useQuery({
    queryKey: ['stints', sessionKey],
    queryFn: () => raceApi.getStints(sessionKey),
  });

  const { data: pitStops } = useQuery({
    queryKey: ['pitStops', sessionKey],
    queryFn: () => raceApi.getPitStops(sessionKey),
  });

  const getDriverStints = (driverNumber: number) => {
    return stints?.filter((s) => s.driver_number === driverNumber) || [];
  };

  const getPitCount = (driverNumber: number) => {
    return pitStops?.filter((p) => p.driver_number === driverNumber).length || 0;
  };

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  const formatGap = (gap: number | null) => {
    if (gap === null) return 'Leader';
    if (gap < 1) return `+${(gap * 1000).toFixed(0)}ms`;
    return `+${gap.toFixed(3)}s`;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-5">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Race Leaderboard</CardTitle>
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={isFetching}
            >
              <RefreshCw className={clsx('w-4 h-4', isFetching && 'animate-spin')} />
            </button>
          </CardHeader>

          <div className="space-y-1">
            {leaderboard?.map((entry) => {
              const driver = getDriver(entry.driverNumber);
              const driverStints = getDriverStints(entry.driverNumber);
              const currentStint = driverStints[driverStints.length - 1];
              const pitCount = getPitCount(entry.driverNumber);

              return (
                <div
                  key={entry.driverNumber}
                  onClick={() => setSelectedDriver(entry.driverNumber)}
                  className={clsx(
                    'driver-cell',
                    selectedDriver === entry.driverNumber && 'bg-gray-800'
                  )}
                >
                  <div className={clsx(
                    'position-indicator',
                    entry.position === 1 && 'position-1',
                    entry.position === 2 && 'position-2',
                    entry.position === 3 && 'position-3',
                    entry.position > 3 && 'bg-gray-700 text-gray-300'
                  )}>
                    {entry.position}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.driverName}</span>
                      <span className="text-xs text-gray-400">{driver?.name_acronym}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{entry.teamName}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {currentStint && (
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: TYRE_COLORS[currentStint.compound] || '#888',
                          backgroundColor: `${TYRE_COLORS[currentStint.compound]}33`,
                        }}
                        title={`${currentStint.compound} (${currentStint.tyre_age_at_start}+ laps)`}
                      >
                        <Circle className="w-3 h-3" style={{ color: TYRE_COLORS[currentStint.compound] }} />
                      </div>
                    )}

                    {pitCount > 0 && (
                      <Badge variant="yellow">{pitCount} pit</Badge>
                    )}

                    <span className="text-sm font-mono text-gray-300 w-24 text-right">
                      {formatGap(entry.gapToLeader)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <Card>
          <CardHeader>
            <CardTitle>Tyre Strategy</CardTitle>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2 px-3">Pos</th>
                  <th className="text-left py-2 px-3">Driver</th>
                  <th className="text-left py-2 px-3">Stints</th>
                  <th className="text-left py-2 px-3">Compounds</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard?.slice(0, 10).map((entry) => {
                  const driverStints = getDriverStints(entry.driverNumber);
                  const driver = getDriver(entry.driverNumber);

                  return (
                    <tr key={entry.driverNumber} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-2 px-3 font-medium">{entry.position}</td>
                      <td className="py-2 px-3">
                        <div>
                          <span>{driver?.name_acronym}</span>
                          <span className="text-xs text-gray-400 ml-2">{entry.teamName.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-0.5">
                          {driverStints.map((stint, i) => (
                            <div
                              key={i}
                              className="w-6 h-4 rounded-sm"
                              style={{
                                backgroundColor: TYRE_COLORS[stint.compound] || '#888',
                              }}
                              title={`${stint.compound}: Laps ${stint.lap_start}-${stint.lap_end}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          {driverStints.map((stint, i) => (
                            <Badge
                              key={i}
                              variant={stint.compound === 'SOFT' ? 'red' : stint.compound === 'MEDIUM' ? 'yellow' : 'blue'}
                            >
                              {stint.compound.charAt(0)}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
