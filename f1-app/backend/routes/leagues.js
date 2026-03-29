import express from 'express';
import {
  getUserLeagues,
  getLeagueDetails,
  getWeeklyStats,
  createLeague,
  joinLeague
} from '../data/leaguesData.js';

const router = express.Router();

// GET /api/leagues — list user leagues
router.get('/', (req, res) => {
  const leagues = getUserLeagues('u1');
  res.json(leagues);
});

// GET /api/leagues/:id — league details + leaderboard
router.get('/:id', (req, res) => {
  const details = getLeagueDetails(req.params.id);
  if (!details) return res.status(404).json({ error: 'League not found' });
  res.json(details);
});

// POST /api/leagues/create — create new league
router.post('/create', (req, res) => {
  const { name, maxMembers, isPrivate } = req.body;
  if (!name) return res.status(400).json({ error: 'League name required' });
  const result = createLeague(name, maxMembers || 8, !!isPrivate);
  res.json(result);
});

// POST /api/leagues/join — join via code
router.post('/join', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'League code required' });
  const result = joinLeague(code.toUpperCase());
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// GET /api/leagues/:id/weekly — weekly stats
router.get('/:id/weekly', (req, res) => {
  const stats = getWeeklyStats(req.params.id);
  if (!stats) return res.status(404).json({ error: 'League not found' });
  res.json(stats);
});

export default router;
