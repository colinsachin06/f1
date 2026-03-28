import api from './api';
import type { Session, Driver, LeaderboardEntry, Lap, Stint, CarData, Location, PitStop, Weather, Overtake, TeamRadio, RaceControl, ChampionshipStanding } from '../types';

export const raceApi = {
  getSessions: async (year?: number) => {
    const params = year ? { year } : {};
    const { data } = await api.get('/race/sessions', { params });
    return data.sessions as Session[];
  },

  getLatestSession: async () => {
    const { data } = await api.get('/race/sessions/latest');
    return data.sessions as Session[];
  },

  getSession: async (sessionKey: number) => {
    const { data } = await api.get(`/race/sessions/${sessionKey}`);
    return data.sessions as Session[];
  },

  getDrivers: async (sessionKey: number) => {
    const { data } = await api.get('/race/drivers', { params: { sessionKey } });
    return data.drivers as Driver[];
  },

  getPositions: async (sessionKey: number) => {
    const { data } = await api.get('/race/positions', { params: { sessionKey } });
    return data.positions;
  },

  getIntervals: async (sessionKey: number) => {
    const { data } = await api.get('/race/intervals', { params: { sessionKey } });
    return data.intervals;
  },

  getLeaderboard: async (sessionKey: number) => {
    const { data } = await api.get('/race/leaderboard', { params: { sessionKey } });
    return data.leaderboard as LeaderboardEntry[];
  },

  getLaps: async (sessionKey: number, driverNumber?: number) => {
    const { data } = await api.get('/race/laps', { params: { sessionKey, driverNumber } });
    return data.laps as Lap[];
  },

  getStints: async (sessionKey: number) => {
    const { data } = await api.get('/race/stints', { params: { sessionKey } });
    return data.stints as Stint[];
  },

  getTelemetry: async (sessionKey: number, driverNumber?: number) => {
    const { data } = await api.get('/race/telemetry', { params: { sessionKey, driverNumber } });
    return data.carData as CarData[];
  },

  getLocation: async (sessionKey: number) => {
    const { data } = await api.get('/race/location', { params: { sessionKey } });
    return data.location as Location[];
  },

  getPitStops: async (sessionKey: number) => {
    const { data } = await api.get('/race/pit', { params: { sessionKey } });
    return data.pit as PitStop[];
  },

  getWeather: async (sessionKey: number) => {
    const { data } = await api.get('/race/weather', { params: { sessionKey } });
    return data.weather as Weather[];
  },

  getOvertakes: async (sessionKey: number) => {
    const { data } = await api.get('/race/overtakes', { params: { sessionKey } });
    return data.overtakes as Overtake[];
  },

  getTeamRadio: async (sessionKey: number) => {
    const { data } = await api.get('/race/team-radio', { params: { sessionKey } });
    return data.teamRadio as TeamRadio[];
  },

  getRaceControl: async (sessionKey: number) => {
    const { data } = await api.get('/race/race-control', { params: { sessionKey } });
    return data.raceControl as RaceControl[];
  },

  getChampionship: async (sessionKey: number) => {
    const { data } = await api.get('/race/championship', { params: { sessionKey } });
    return data as { drivers: ChampionshipStanding[]; teams: ChampionshipStanding[] };
  },

  getMeetings: async (year: number) => {
    const { data } = await api.get('/race/meetings', { params: { year } });
    return data.meetings;
  },

  getStartingGrid: async (sessionKey: number) => {
    const { data } = await api.get('/race/starting-grid', { params: { sessionKey } });
    return data.grid;
  },

  getResults: async (sessionKey: number) => {
    const { data } = await api.get('/race/results', { params: { sessionKey } });
    return data.results;
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  register: async (email: string, username: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};

export const userApi = {
  getProfile: async () => {
    const { data } = await api.get('/user/profile');
    return data.user;
  },

  getFantasyTeams: async () => {
    const { data } = await api.get('/user/fantasy-teams');
    return data.teams;
  },

  saveFantasyTeam: async (sessionKey: number, drivers: number[], budget?: number) => {
    const { data } = await api.post('/user/fantasy-teams', { sessionKey, drivers, budget });
    return data.team;
  },

  getBets: async () => {
    const { data } = await api.get('/user/bets');
    return data.bets;
  },

  placeBet: async (sessionKey: number, market: string, driverNumber: number, odds: number, stake: number) => {
    const { data } = await api.post('/user/bets', { sessionKey, market, driverNumber, odds, stake });
    return data;
  },

  getPredictions: async () => {
    const { data } = await api.get('/user/predictions');
    return data.predictions;
  },

  savePrediction: async (sessionKey: number, prediction: { pole: number; p2: number; p3: number; fastestLap: number; dnf1: number; dnf2: number }) => {
    const { data } = await api.post('/user/predictions', { sessionKey, ...prediction });
    return data.prediction;
  },

  getChatHistory: async () => {
    const { data } = await api.get('/user/chat-history');
    return data.messages;
  },
};

export const chatApi = {
  sendMessage: async (message: string, sessionKey?: number) => {
    const { data } = await api.post('/chat', { message, sessionKey });
    return data.response;
  },

  getHistory: async () => {
    const { data } = await api.get('/chat/history');
    return data.messages;
  },

  clearHistory: async () => {
    await api.delete('/chat/history');
  },
};
