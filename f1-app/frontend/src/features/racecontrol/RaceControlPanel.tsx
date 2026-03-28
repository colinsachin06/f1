import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner, Badge } from '../../components/ui';
import { Flag, AlertTriangle, Car, Clock, Info } from 'lucide-react';
import clsx from 'clsx';

const FLAG_COLORS: Record<string, string> = {
  'GREEN': 'bg-green-500',
  'YELLOW': 'bg-yellow-500',
  'DOUBLE YELLOW': 'bg-yellow-500',
  'RED': 'bg-red-500',
  'CHEQUERED': 'bg-black',
  'WHITE': 'bg-white',
  'BLACK AND WHITE': 'bg-gradient-to-r from-black via-white to-black',
  'BLACK': 'bg-black',
};

const CATEGORY_ICONS: Record<string, any> = {
  'Flag': Flag,
  'CarEvent': Car,
  'SafetyCar': AlertTriangle,
  'SessionStatus': Clock,
  'Drs': Info,
};

export default function RaceControlPanel({ sessionKey }: { sessionKey: number }) {
  const { drivers } = useRaceStore();

  const { data: raceControl, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['raceControl', sessionKey],
    queryFn: () => raceApi.getRaceControl(sessionKey),
    refetchInterval: 5000,
  });

  const getDriver = (driverNumber?: number) => {
    if (!driverNumber) return null;
    return drivers.find((d) => d.driver_number === driverNumber);
  };

  if (isLoading) return <LoadingSpinner />;

  const sortedEvents = [...(raceControl || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const safetyCarEvents = sortedEvents.filter((e: any) => 
    e.flag?.includes('YELLOW') || e.flag?.includes('SC') || e.flag?.includes('RED')
  );

  const flagEvents = sortedEvents.filter((e: any) => 
    e.category === 'Flag' && e.flag && !e.flag?.includes('YELLOW')
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Race Control</CardTitle>
            {isFetching && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <button
            onClick={() => refetch()}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Refresh
          </button>
        </CardHeader>

        {(!raceControl || raceControl.length === 0) ? (
          <div className="text-center py-8 text-gray-400">
            No race control events recorded
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {sortedEvents.slice(0, 20).map((event: any, index: number) => {
              const IconComponent = CATEGORY_ICONS[event.category] || Info;
              const flagColor = FLAG_COLORS[event.flag] || 'bg-gray-500';

              return (
                <div
                  key={index}
                  className={clsx(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors',
                    event.flag?.includes('RED') && 'bg-red-900/30 border border-red-700',
                    event.flag?.includes('YELLOW') && 'bg-yellow-900/30 border border-yellow-700',
                    event.category === 'SafetyCar' && 'bg-orange-900/30 border border-orange-700',
                    !event.flag && 'bg-gray-800/50 hover:bg-gray-800'
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    {event.flag ? (
                      <div className={clsx('w-4 h-4 rounded-sm', flagColor)} />
                    ) : (
                      <IconComponent className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {event.lap_number ? `L${event.lap_number}` : ''}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">{event.message}</p>
                    {event.driver_number && (
                      <p className="text-xs text-gray-400 mt-1">
                        Driver: {getDriver(event.driver_number)?.name_acronym || event.driver_number}
                        {event.sector && ` | Sector ${event.sector}`}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(event.date).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {safetyCarEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Safety Car Status
            </CardTitle>
          </CardHeader>

          <div className="space-y-2">
            {safetyCarEvents.slice(0, 5).map((event: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-yellow-900/20 rounded"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="yellow">
                    {event.flag?.includes('SC') ? 'SC' : event.flag?.includes('RED') ? 'RED FLAG' : 'YELLOW'}
                  </Badge>
                  <span className="text-sm">{event.message?.substring(0, 50)}...</span>
                </div>
                <span className="text-xs text-gray-400">
                  Lap {event.lap_number}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {flagEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-white" />
              Race Flags
            </CardTitle>
          </CardHeader>

          <div className="flex gap-2 flex-wrap">
            {[...new Set(flagEvents.map((e: any) => e.flag))].map((flag: string) => (
              <Badge
                key={flag}
                variant={flag === 'CHEQUERED' ? 'purple' : flag === 'GREEN' ? 'green' : 'yellow'}
              >
                {flag}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
