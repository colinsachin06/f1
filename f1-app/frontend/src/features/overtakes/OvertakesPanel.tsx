import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner, Badge } from '../../components/ui';
import { ArrowRight, Trophy } from 'lucide-react';
import clsx from 'clsx';

export default function OvertakesPanel({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();

  const { data: overtakes, isLoading } = useQuery({
    queryKey: ['overtakes', sessionKey],
    queryFn: () => raceApi.getOvertakes(sessionKey),
    refetchInterval: 5000,
  });

  const getDriver = (driverNumber: number) => {
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (isLoading) return <LoadingSpinner />;

  if (!overtakes || overtakes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overtakes</CardTitle>
        </CardHeader>
        <div className="text-center py-8 text-gray-400">
          No overtakes recorded yet
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Overtake Timeline</CardTitle>
        <Badge variant="green">{overtakes.length} overtakes</Badge>
      </CardHeader>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {overtakes.map((overtake: any, index: number) => {
          const overtakingDriver = getDriver(overtake.overtaking_driver_number);
          const overtakenDriver = getDriver(overtake.overtaken_driver_number);

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">
                  #{index + 1}
                </span>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: overtakingDriver?.team_colour || '#888' }}
                    >
                      <span className="text-white">{overtakingDriver?.name_acronym?.charAt(0) || '?'}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {overtakingDriver?.name_acronym || overtake.overtaking_driver_number}
                    </span>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-green-400" />
                  
                  <div className="flex items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-60"
                      style={{ backgroundColor: overtakenDriver?.team_colour || '#888' }}
                    >
                      <span className="text-white">{overtakenDriver?.name_acronym?.charAt(0) || '?'}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {overtakenDriver?.name_acronym || overtake.overtaken_driver_number}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={overtake.position <= 3 ? 'purple' : 'blue'}>
                  P{overtake.position}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(overtake.date).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-medium mb-2">Top Overtakers</h4>
        <div className="grid grid-cols-2 gap-2">
          {getTopOvertakers(overtakes)?.slice(0, 4).map((item: any, index: number) => {
            const driver = getDriver(item.driver_number);
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-900/50 rounded"
              >
                <Trophy className={clsx(
                  'w-4 h-4',
                  index === 0 && 'text-yellow-500',
                  index === 1 && 'text-gray-400',
                  index === 2 && 'text-amber-600'
                )} />
                <span className="text-sm">{driver?.name_acronym}</span>
                <span className="text-xs text-gray-400 ml-auto">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function getTopOvertakers(overtakes: any[]) {
  const counts: Record<number, number> = {};
  overtakes.forEach((o) => {
    counts[o.overtaking_driver_number] = (counts[o.overtaking_driver_number] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([driver_number, count]) => ({ driver_number: parseInt(driver_number), count }))
    .sort((a, b) => b.count - a.count);
}
