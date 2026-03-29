import express from 'express';
import driversData from '../data/driversData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(driversData);
});

export default router;
