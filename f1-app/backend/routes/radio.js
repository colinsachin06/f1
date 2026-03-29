import express from 'express';
import { races, radioEntries } from '../data/radioData.js';

const router = express.Router();

router.get('/races', (req, res) => {
  res.json(races);
});

router.get('/', (req, res) => {
  let filtered = [...radioEntries];
  const { race, drivers, category } = req.query;

  if (race) {
    filtered = filtered.filter(e => e.race === race);
  }
  if (drivers) {
    const driverList = drivers.split(',').map(d => d.trim().toUpperCase());
    filtered = filtered.filter(e => driverList.includes(e.driverCode));
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(e => e.category === category.toLowerCase());
  }

  filtered.sort((a, b) => a.lap - b.lap);
  res.json(filtered);
});

export default router;
