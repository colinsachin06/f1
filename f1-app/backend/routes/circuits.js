import express from 'express';
import circuitsData from '../data/circuitsData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(circuitsData);
});

export default router;
