import express from 'express';
import driverSentiment from '../data/sentimentData.js';

const router = express.Router();

router.get('/:driverCode', (req, res) => {
  const code = req.params.driverCode.toUpperCase();
  const data = driverSentiment[code];
  if (!data) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(data);
});

export default router;
