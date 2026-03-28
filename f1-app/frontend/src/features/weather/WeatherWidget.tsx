import { useQuery } from '@tanstack/react-query';
import { raceApi } from '../../services/apiService';
import { Thermometer, Droplets, Wind } from 'lucide-react';

export default function WeatherWidget({ sessionKey }: { sessionKey: number }) {
  const { data: weather } = useQuery({
    queryKey: ['weather', sessionKey],
    queryFn: () => raceApi.getWeather(sessionKey),
    refetchInterval: 30000,
  });

  if (!weather || weather.length === 0) {
    return null;
  }

  const latestWeather = weather[weather.length - 1];

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-red-400" />
        <span className="text-sm">
          <span className="text-gray-400">Track:</span>{' '}
          <span className="font-medium">{latestWeather.track_temperature?.toFixed(0) || '--'}°C</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-blue-400" />
        <span className="text-sm">
          <span className="text-gray-400">Air:</span>{' '}
          <span className="font-medium">{latestWeather.air_temperature?.toFixed(0) || '--'}°C</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4 text-blue-300" />
        <span className="text-sm">
          <span className="text-gray-400">Humidity:</span>{' '}
          <span className="font-medium">{latestWeather.humidity?.toFixed(0) || '--'}%</span>
        </span>
      </div>

      {latestWeather.rainfall && (
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-900/50 rounded">
          <span className="text-sm text-blue-300">🌧️ Rain</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 text-gray-400" />
        <span className="text-sm">
          <span className="font-medium">{latestWeather.wind_speed?.toFixed(1) || '--'}</span>
          <span className="text-gray-400 ml-1">km/h</span>
        </span>
      </div>
    </div>
  );
}
