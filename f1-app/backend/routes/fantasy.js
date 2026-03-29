import express from 'express';
import { fantasyDrivers, fantasyConstructors } from '../data/fantasyData.js';

const router = express.Router();

router.get('/drivers', (req, res) => {
  res.json(fantasyDrivers);
});

router.get('/constructors', (req, res) => {
  res.json(fantasyConstructors);
});

router.post('/team', (req, res) => {
  const { drivers, constructor, captain } = req.body;
  if (!drivers || !constructor) {
    return res.status(400).json({ error: 'drivers and constructor required' });
  }

  const selectedDrivers = fantasyDrivers.filter(d => drivers.includes(d.id));
  const selectedConstructor = fantasyConstructors.find(c => c.id === constructor);
  const totalCost = selectedDrivers.reduce((sum, d) => sum + d.price, 0) + (selectedConstructor ? selectedConstructor.price : 0);
  const predictedTotal = selectedDrivers.reduce((sum, d) => sum + d.predictedPoints, 0) + (selectedConstructor ? selectedConstructor.predictedPoints : 0);

  res.json({
    saved: true,
    teamId: 'team_' + Date.now(),
    totalCost: Math.round(totalCost * 10) / 10,
    predictedTotal
  });
});

export default router;
