import express from 'express';
import constructorsData from '../data/constructorsData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(constructorsData);
});

export default router;
