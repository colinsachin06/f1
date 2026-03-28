import { Router } from 'express';
import { z } from 'zod';
import { openF1Service } from '../services/openF1.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuth } from '../middleware/auth.js';

export const raceRouter = Router();

const querySchema = z.object({
  sessionKey: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  countryName: z.string().optional(),
  driverNumber: z.coerce.number().optional(),
});

raceRouter.get('/sessions', asyncHandler(async (req, res) => {
  const { year, countryName } = querySchema.parse(req.query);
  const sessions = await openF1Service.getSessions(year, countryName);
  res.json({ sessions });
}));

raceRouter.get('/sessions/latest', asyncHandler(async (req, res) => {
  const sessions = await openF1Service.getLatestSession();
  res.json({ sessions });
}));

raceRouter.get('/sessions/:sessionKey', asyncHandler(async (req, res) => {
  const sessionKey = parseInt(req.params.sessionKey);
  const sessions = await openF1Service.getSession(sessionKey);
  res.json({ sessions });
}));

raceRouter.get('/drivers', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const drivers = await openF1Service.getDrivers(sessionKey);
  res.json({ drivers });
}));

raceRouter.get('/positions', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const positions = await openF1Service.getPositions(sessionKey);
  res.json({ positions });
}));

raceRouter.get('/intervals', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const intervals = await openF1Service.getIntervals(sessionKey);
  res.json({ intervals });
}));

raceRouter.get('/leaderboard', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  
  const [drivers, intervals, positions] = await Promise.all([
    openF1Service.getDrivers(sessionKey),
    openF1Service.getIntervals(sessionKey),
    openF1Service.getPositions(sessionKey),
  ]);
  
  const leaderboard = intervals.map(interval => {
    const driver = drivers.find(d => d.driver_number === interval.driver_number);
    const position = positions.find(p => p.driver_number === interval.driver_number);
    return {
      position: position?.position || 0,
      driverNumber: interval.driver_number,
      driverName: driver ? `${driver.first_name} ${driver.last_name}` : `Driver ${interval.driver_number}`,
      teamName: driver?.team_name || 'Unknown',
      teamColor: driver?.team_colour || '#888888',
      gapToLeader: interval.gap_to_leader,
      interval: interval.interval,
    };
  }).sort((a, b) => a.position - b.position);
  
  res.json({ leaderboard });
}));

raceRouter.get('/laps', asyncHandler(async (req, res) => {
  const { sessionKey, driverNumber } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const laps = await openF1Service.getLaps(sessionKey, driverNumber);
  res.json({ laps });
}));

raceRouter.get('/stints', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const stints = await openF1Service.getStints(sessionKey);
  res.json({ stints });
}));

raceRouter.get('/telemetry', asyncHandler(async (req, res) => {
  const { sessionKey, driverNumber } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const carData = await openF1Service.getCarData(sessionKey, driverNumber);
  res.json({ carData });
}));

raceRouter.get('/location', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const location = await openF1Service.getLocation(sessionKey);
  res.json({ location });
}));

raceRouter.get('/pit', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const pit = await openF1Service.getPit(sessionKey);
  res.json({ pit });
}));

raceRouter.get('/weather', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const weather = await openF1Service.getWeather(sessionKey);
  res.json({ weather });
}));

raceRouter.get('/overtakes', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const overtakes = await openF1Service.getOvertakes(sessionKey);
  res.json({ overtakes });
}));

raceRouter.get('/team-radio', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const teamRadio = await openF1Service.getTeamRadio(sessionKey);
  res.json({ teamRadio });
}));

raceRouter.get('/race-control', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const raceControl = await openF1Service.getRaceControl(sessionKey);
  res.json({ raceControl });
}));

raceRouter.get('/results', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const results = await openF1Service.getSessionResults(sessionKey);
  res.json({ results });
}));

raceRouter.get('/meetings', asyncHandler(async (req, res) => {
  const { year } = querySchema.parse(req.query);
  const meetings = await openF1Service.getMeetings(year || new Date().getFullYear());
  res.json({ meetings });
}));

raceRouter.get('/championship', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  
  const [drivers, teams] = await Promise.all([
    openF1Service.getChampionshipDrivers(sessionKey),
    openF1Service.getChampionshipTeams(sessionKey),
  ]);
  
  res.json({ drivers, teams });
}));

raceRouter.get('/starting-grid', asyncHandler(async (req, res) => {
  const { sessionKey } = querySchema.parse(req.query);
  if (!sessionKey) {
    return res.status(400).json({ error: 'sessionKey is required' });
  }
  const grid = await openF1Service.getStartingGrid(sessionKey);
  res.json({ grid });
}));
