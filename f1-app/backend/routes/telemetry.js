import express from 'express';
import { getTelemetryData, driverProfiles } from '../data/telemetryData.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { driver = 'VER', session = 'qualifying', lap = 'best' } = req.query;
  const code = driver.toUpperCase();

  const data = getTelemetryData(code, session, lap);
  if (!data) {
    return res.status(404).json({ error: 'Driver or session not found' });
  }
  res.json(data);
});

router.get('/drivers', (req, res) => {
  const drivers = Object.keys(driverProfiles).map(code => ({
    code,
    name: driverProfiles[code].driverName,
    team: driverProfiles[code].team,
    teamColor: driverProfiles[code].teamColor
  }));
  res.json(drivers);
});

export default router;
