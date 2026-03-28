import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';

const TYRE_COLORS: Record<string, string> = {
  SOFT: '#FF3333',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#43B02A',
  WET: '#0067AD',
};

export default function Strategy({ sessionKey }: { sessionKey: number }) {
  const { drivers: storeDrivers, selectedDriver, setSelectedDriver } = useRaceStore();

  const { data: stints, isLoading: stintsLoading } = useQuery({
    queryKey: ['stints', sessionKey],
    queryFn: () => raceApi.getStints(sessionKey),
  });

  const { data: pitStops, isLoading: pitLoading } = useQuery({
    queryKey: ['pitStops', sessionKey],
    queryFn: () => raceApi.getPitStops(sessionKey),
  });

  const { data: apiDrivers } = useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => raceApi.getDrivers(sessionKey),
  });

  const drivers = storeDrivers.length > 0 ? storeDrivers : apiDrivers || [];

  if (stintsLoading || pitLoading) return <LoadingSpinner />;

  const getDriverStints = (driverNumber: number) => {
    return stints?.filter((s) => s.driver_number === driverNumber) || [];
  };

  const getDriverPitStops = (driverNumber: number) => {
    return pitStops?.filter((p) => p.driver_number === driverNumber) || [];
  };

  const getDriver = (driverNumber: number) => {
    return (drivers as any[])?.find((d) => d.driver_number === driverNumber);
  };

  const driversWithData = [...new Set(stints?.map((s) => s.driver_number) || [])];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tyre Strategy Timeline</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {driversWithData.slice(0, 10).map((driverNumber) => {
            const driver = getDriver(driverNumber);
            const driverStints = getDriverStints(driverNumber);
            const driverPits = getDriverPitStops(driverNumber);
            const isSelected = selectedDriver === driverNumber;

            const maxLap = Math.max(...driverStints.map((s) => s.lap_end), 1);
            const scale = 100 / maxLap;

            return (
              <div
                key={driverNumber}
                onClick={() => setSelectedDriver(driverNumber)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-gray-800' : 'bg-gray-900/50 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: driver?.team_colour || '#888' }}
                  />
                  <span className="font-medium">{driver?.name_acronym || driverNumber}</span>
                  <span className="text-sm text-gray-400">{driver?.team_name}</span>
                  <span className="ml-auto text-sm text-gray-400">
                    {driverStints.length} stints | {driverPits.length} pits
                  </span>
                </div>

                <div className="relative h-8 bg-gray-950 rounded">
                  {driverStints.map((stint, i) => (
                    <div
                      key={i}
                      className="absolute top-1 bottom-1 rounded-sm transition-all"
                      style={{
                        left: `${(stint.lap_start - 1) * scale}%`,
                        width: `${(stint.lap_end - stint.lap_start + 1) * scale}%`,
                        backgroundColor: TYRE_COLORS[stint.compound] || '#888',
                      }}
                      title={`${stint.compound} (Lap ${stint.lap_start}-${stint.lap_end}, Age: ${stint.tyre_age_at_start})`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                        {stint.compound.charAt(0)}
                      </span>
                    </div>
                  ))}

                  {driverPits.map((pit, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-0.5 bg-white"
                      style={{ left: `${(pit.lap_number - 1) * scale}%` }}
                      title={`Pit: ${pit.stop_duration.toFixed(1)}s`}
                    />
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  {driverStints.map((stint, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${TYRE_COLORS[stint.compound]}33`,
                        color: TYRE_COLORS[stint.compound],
                      }}
                    >
                      {stint.compound.charAt(0)} {stint.lap_start}-{stint.lap_end}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>

        <div className="flex gap-4">
          {Object.entries(TYRE_COLORS).map(([compound, color]) => (
            <div key={compound} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{compound}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
