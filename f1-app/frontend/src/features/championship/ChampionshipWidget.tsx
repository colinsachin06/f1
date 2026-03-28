import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';
import { Trophy, Users } from 'lucide-react';
import clsx from 'clsx';

export default function ChampionshipWidget({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();

  const { data: championship, isLoading } = useQuery({
    queryKey: ['championship', sessionKey],
    queryFn: () => raceApi.getChampionship(sessionKey),
    refetchInterval: 30000,
  });

  const getDriver = (driverNumber?: number) => {
    if (!driverNumber) return null;
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (isLoading) return <LoadingSpinner />;

  const driversStandings = championship?.drivers?.sort(
    (a: any, b: any) => a.position_current - b.position_current
  ) || [];

  const teamsStandings = championship?.teams?.sort(
    (a: any, b: any) => a.position_current - b.position_current
  ) || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Driver Championship
          </CardTitle>
        </CardHeader>

        {driversStandings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Championship data not available for this session
          </div>
        ) : (
          <div className="space-y-1">
            {driversStandings.map((standing: any, index: number) => {
              const driver = getDriver(standing.driver_number);
              const pointsGained = standing.points_current - standing.points_start;

              return (
                <div
                  key={standing.driver_number}
                  className={clsx(
                    'flex items-center gap-3 p-2 rounded-lg transition-colors',
                    index < 3 ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    index === 0 && 'bg-yellow-500 text-black',
                    index === 1 && 'bg-gray-400 text-black',
                    index === 2 && 'bg-amber-700 text-white',
                    index > 2 && 'bg-gray-700 text-gray-300'
                  )}>
                    {standing.position_current}
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: driver?.team_colour || '#888' }}
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-sm truncate block">
                        {driver?.full_name || `Driver ${standing.driver_number}`}
                      </span>
                      <span className="text-xs text-gray-400">
                        {driver?.team_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-f1 font-bold">{standing.points_current}</div>
                    {pointsGained > 0 && (
                      <div className="text-xs text-green-400">
                        +{pointsGained}
                      </div>
                    )}
                    {pointsGained < 0 && (
                      <div className="text-xs text-red-400">
                        {pointsGained}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Constructor Championship
          </CardTitle>
        </CardHeader>

        {teamsStandings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Constructor standings not available
          </div>
        ) : (
          <div className="space-y-1">
            {teamsStandings.map((standing: any, index: number) => {
              const pointsGained = standing.points_current - standing.points_start;

              return (
                <div
                  key={standing.team_name}
                  className={clsx(
                    'flex items-center gap-3 p-2 rounded-lg transition-colors',
                    index < 3 ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    index === 0 && 'bg-yellow-500 text-black',
                    index === 1 && 'bg-gray-400 text-black',
                    index === 2 && 'bg-amber-700 text-white',
                    index > 2 && 'bg-gray-700 text-gray-300'
                  )}>
                    {standing.position_current}
                  </div>

                  <div className="flex-1">
                    <span className="font-medium text-sm">{standing.team_name}</span>
                  </div>

                  <div className="text-right">
                    <div className="font-f1 font-bold">{standing.points_current}</div>
                    {pointsGained > 0 && (
                      <div className="text-xs text-green-400">
                        +{pointsGained}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
