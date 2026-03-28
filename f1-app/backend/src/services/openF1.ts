import axios from 'axios';
import { cacheService, CACHE_KEYS } from './cache.js';

const BASE_URL = process.env.OPENF1_BASE_URL || 'https://api.openf1.org/v1';
const REQUEST_DELAY = 350; // ~3 requests per second limit

let lastRequestTime = 0;

const rateLimitedRequest = async <T>(url: string, cacheKey?: string, ttl?: number): Promise<T> => {
  if (cacheKey) {
    const cached = cacheService.get<T>(cacheKey);
    if (cached) return cached;
  }
  
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  const response = await axios.get<T>(`${BASE_URL}${url}`, {
    headers: { Accept: 'application/json' },
    timeout: 30000,
  });
  
  if (cacheKey) {
    cacheService.set(cacheKey, response.data, ttl);
  }
  
  return response.data;
};

export const openF1Service = {
  async getSessions(year?: number, countryName?: string): Promise<any[]> {
    let url = '/sessions?';
    if (year) url += `year=${year}&`;
    if (countryName) url += `country_name=${encodeURIComponent(countryName)}&`;
    return rateLimitedRequest(url, CACHE_KEYS.SESSIONS, 3600);
  },

  async getSession(sessionKey: number): Promise<any> {
    return rateLimitedRequest(
      `/sessions?session_key=${sessionKey}`,
      CACHE_KEYS.SESSION(sessionKey),
      3600
    );
  },

  async getLatestSession(): Promise<any[]> {
    return rateLimitedRequest('/sessions?session_key=latest', CACHE_KEYS.SESSION(999999), 60);
  },

  async getDrivers(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/drivers?session_key=${sessionKey}`,
      CACHE_KEYS.DRIVERS(sessionKey),
      3600
    );
  },

  async getPositions(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/position?session_key=${sessionKey}`,
      CACHE_KEYS.POSITIONS(sessionKey),
      10
    );
  },

  async getIntervals(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/intervals?session_key=${sessionKey}`,
      CACHE_KEYS.INTERVALS(sessionKey),
      10
    );
  },

  async getLaps(sessionKey: number, driverNumber?: number): Promise<any[]> {
    let url = `/laps?session_key=${sessionKey}`;
    if (driverNumber) url += `&driver_number=${driverNumber}`;
    const cacheKey = CACHE_KEYS.LAPS(sessionKey);
    return rateLimitedRequest(url, cacheKey, 300);
  },

  async getStints(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/stints?session_key=${sessionKey}`,
      CACHE_KEYS.STINTS(sessionKey),
      300
    );
  },

  async getCarData(sessionKey: number, driverNumber?: number): Promise<any[]> {
    let url = `/car_data?session_key=${sessionKey}`;
    if (driverNumber) url += `&driver_number=${driverNumber}`;
    return rateLimitedRequest(url, undefined, 30);
  },

  async getLocation(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/location?session_key=${sessionKey}`,
      CACHE_KEYS.LOCATION(sessionKey),
      10
    );
  },

  async getPit(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/pit?session_key=${sessionKey}`,
      CACHE_KEYS.PIT(sessionKey),
      60
    );
  },

  async getWeather(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/weather?session_key=${sessionKey}`,
      CACHE_KEYS.WEATHER(sessionKey),
      30
    );
  },

  async getOvertakes(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/overtakes?session_key=${sessionKey}`,
      CACHE_KEYS.OVERTAKES(sessionKey),
      60
    );
  },

  async getTeamRadio(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/team_radio?session_key=${sessionKey}`,
      CACHE_KEYS.TEAM_RADIO(sessionKey),
      60
    );
  },

  async getRaceControl(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/race_control?session_key=${sessionKey}`,
      CACHE_KEYS.RACE_CONTROL(sessionKey),
      30
    );
  },

  async getSessionResults(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/session_result?session_key=${sessionKey}`,
      CACHE_KEYS.RESULTS(sessionKey),
      300
    );
  },

  async getMeetings(year: number): Promise<any[]> {
    return rateLimitedRequest(
      `/meetings?year=${year}`,
      CACHE_KEYS.MEETINGS(year),
      3600
    );
  },

  async getChampionshipDrivers(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/championship_drivers?session_key=${sessionKey}`,
      CACHE_KEYS.CHAMPIONSHIP_DRIVERS(sessionKey),
      60
    );
  },

  async getChampionshipTeams(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(
      `/championship_teams?session_key=${sessionKey}`,
      CACHE_KEYS.CHAMPIONSHIP_TEAMS(sessionKey),
      60
    );
  },

  async getStartingGrid(sessionKey: number): Promise<any[]> {
    return rateLimitedRequest(`/starting_grid?session_key=${sessionKey}`, undefined, 300);
  },
};
