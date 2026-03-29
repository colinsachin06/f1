import express from 'express';
import { leaderboard, currentRace, driverTeamColors } from '../data/predictionsData.js';

const router = express.Router();

router.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

router.get('/current-race', (req, res) => {
  res.json(currentRace);
});

router.post('/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers) {
    return res.status(400).json({ error: 'answers required' });
  }
  res.json({
    success: true,
    submittedAt: new Date().toISOString(),
    totalPossible: 275
  });
});

export default router;
