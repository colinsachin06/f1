import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 3600, // 1 hour default
  checkperiod: 300,
  useClones: false,
});

export const cacheService = {
  get: <T>(key: string): T | undefined => {
    return cache.get<T>(key);
  },
  
  set: <T>(key: string, value: T, ttl?: number): boolean => {
    return cache.set(key, value, ttl);
  },
  
  del: (key: string): number => {
    return cache.del(key);
  },
  
  flush: (): void => {
    cache.flushAll();
  },
  
  getStats: () => {
    return cache.getStats();
  },
};

export const CACHE_KEYS = {
  SESSIONS: 'sessions',
  SESSION: (key: number) => `session:${key}`,
  DRIVERS: (key: number) => `drivers:${key}`,
  POSITIONS: (key: number) => `positions:${key}`,
  INTERVALS: (key: number) => `intervals:${key}`,
  LAPS: (key: number) => `laps:${key}`,
  STINTS: (key: number) => `stints:${key}`,
  CAR_DATA: (key: number, driver: number) => `car_data:${key}:${driver}`,
  LOCATION: (key: number) => `location:${key}`,
  PIT: (key: number) => `pit:${key}`,
  WEATHER: (key: number) => `weather:${key}`,
  OVERTAKES: (key: number) => `overtakes:${key}`,
  TEAM_RADIO: (key: number) => `team_radio:${key}`,
  RACE_CONTROL: (key: number) => `race_control:${key}`,
  RESULTS: (key: number) => `results:${key}`,
  MEETINGS: (year: number) => `meetings:${year}`,
  CHAMPIONSHIP_DRIVERS: (key: number) => `championship_drivers:${key}`,
  CHAMPIONSHIP_TEAMS: (key: number) => `championship_teams:${key}`,
};
