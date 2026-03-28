import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner, Badge } from '../../components/ui';
import { Flag, Clock } from 'lucide-react';
import clsx from 'clsx';

export default function SessionResults({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();

  const { data: results, isLoading } = useQuery({
    queryKey: ['results', sessionKey],
    queryFn: () => raceApi.getResults(sessionKey),
  });

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (isLoading) return <LoadingSpinner />;

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Results</CardTitle>
        </CardHeader>
        <div className="text-center py-8 text-gray-400">
          Results not yet available for this session
        </div>
      </Card>
    );
  }

  const sortedResults = [...results].sort((a: any, b: any) => a.position - b.position);

  const fastestLap = sortedResults.reduce((fastest: any, current: any) => {
    if (current.dnf || current.dns || current.dsq) return fastest;
    const currentTime = current.duration;
    const fastestTime = fastest?.duration || Infinity;
    return currentTime < fastestTime ? current : fastest;
  }, null);

  const formatTime = (time: number | null, isGap: boolean = false) => {
    if (time === null || time === undefined) return '--';
    if (isGap && time === 0) return 'WINNER';
    if (time < 100) return `+${(time).toFixed(3)}s`;
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-green-500" />
          Race Results
        </CardTitle>
        <Badge variant="green">{sortedResults.length} classified</Badge>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 px-3">Pos</th>
              <th className="text-left py-2 px-3">Driver</th>
              <th className="text-left py-2 px-3">Team</th>
              <th className="text-right py-2 px-3">Laps</th>
              <th className="text-right py-2 px-3">Gap</th>
              <th className="text-right py-2 px-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result: any) => {
              const driver = getDriver(result.driver_number);
              const isFastest = fastestLap?.driver_number === result.driver_number;
              const hasIssue = result.dnf || result.dns || result.dsq;

              return (
                <tr
                  key={result.driver_number}
                  className={clsx(
                    'border-b border-gray-800',
                    result.position <= 3 && 'bg-gray-800/30',
                    hasIssue && 'opacity-60'
                  )}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs',
                        result.position === 1 && 'bg-yellow-500 text-black',
                        result.position === 2 && 'bg-gray-400 text-black',
                        result.position === 3 && 'bg-amber-700 text-white',
                        result.position > 3 && 'bg-gray-700 text-gray-300'
                      )}>
                        {result.position}
                      </span>
                      {isFastest && !hasIssue && (
                        <span className="text-yellow-400 text-xs" title="Fastest Lap">★</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: driver?.team_colour || '#888' }}
                      />
                      <div>
                        <span className="font-medium">{driver?.name_acronym || result.driver_number}</span>
                        <span className="text-xs text-gray-400 ml-2">{driver?.full_name?.split(' ')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-gray-400 text-sm">
                    {driver?.team_name?.split(' ')[0] || 'Unknown'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {result.number_of_laps}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    <span className={clsx(
                      result.gap_to_leader === 0 && 'text-yellow-400 font-bold'
                    )}>
                      {formatTime(result.gap_to_leader, true)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {hasIssue ? (
                      <Badge variant="red">
                        {result.dnf ? 'DNF' : result.dns ? 'DNS' : result.dsq ? 'DSQ' : ''}
                      </Badge>
                    ) : (
                      <span className="font-f1 font-bold">
                        {getPointsForPosition(result.position)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span>Fastest Lap:</span>
          <span className="font-medium">
            {getDriver(fastestLap?.driver_number)?.name_acronym || fastestLap?.driver_number}
          </span>
          <span className="text-yellow-400 font-mono">
            {fastestLap?.duration?.toFixed(3)}s
          </span>
        </div>
      </div>
    </Card>
  );
}

function getPointsForPosition(position: number): number {
  const points: Record<number, number> = {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1,
  };
  return points[position] || 0;
}
