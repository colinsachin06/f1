import express from 'express';
import benchmarksData from '../data/benchmarksData.js';

const router = express.Router();

router.get('/analyze', (req, res) => {
  const { circuit, lactime, platform, level } = req.query;

  if (!circuit || !lactime || !platform || !level) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const circuitData = benchmarksData.circuits[circuit.toLowerCase()];
  if (!circuitData) {
    return res.status(400).json({ error: 'Invalid circuit' });
  }

  const timeParts = lactime.split(':');
  if (timeParts.length !== 2) {
    return res.status(400).json({ error: 'Invalid lap time format' });
  }

  const minutes = parseInt(timeParts[0], 10);
  const secondsParts = timeParts[1].split('.');
  if (secondsParts.length !== 2) {
    return res.status(400).json({ error: 'Invalid lap time format' });
  }

  const seconds = parseInt(secondsParts[0], 10);
  const ms = parseInt(secondsParts[1], 10);
  
  if (isNaN(minutes) || isNaN(seconds) || isNaN(ms)) {
    return res.status(400).json({ error: 'Invalid lap time format' });
  }

  const userTimeMs = (minutes * 60000) + (seconds * 1000) + ms;

  const platformFactor = benchmarksData.platformFactors[platform]?.factor || 1.05;
  const skillConfig = benchmarksData.skillLevels[level] || benchmarksData.skillLevels.rookie;

  const adjustedRacePace = circuitData.f1AvgPace * platformFactor;
  const pctFromF1Race = ((userTimeMs - circuitData.f1RaceRecord) / circuitData.f1RaceRecord) * 100;
  const pctFromF1Quali = ((userTimeMs - circuitData.f1QualiRecord) / circuitData.f1QualiRecord) * 100;

  const f1Sectors = circuitData.f1Sectors;
  const userSectors = circuitData.sectors;
  
  const userS1 = Math.round(userTimeMs * (userSectors.s1 / (userSectors.s1 + userSectors.s2 + userSectors.s3)));
  const userS2 = Math.round(userTimeMs * (userSectors.s2 / (userSectors.s1 + userSectors.s2 + userSectors.s3)));
  const userS3 = userTimeMs - userS1 - userS2;

  let performanceScore;
  if (pctFromF1Quali <= 2) {
    performanceScore = 95;
  } else if (pctFromF1Quali <= 5) {
    performanceScore = Math.round(85 - (pctFromF1Quali - 5) * 2);
  } else if (pctFromF1Quali <= 10) {
    performanceScore = Math.round(70 - (pctFromF1Quali - 10) * 3);
  } else if (pctFromF1Quali <= 20) {
    performanceScore = Math.round(55 - (pctFromF1Quali - 20) * 2);
  } else {
    performanceScore = Math.max(10, Math.round(40 - (pctFromF1Quali - 20)));
  }

  performanceScore = Math.min(100, Math.max(0, performanceScore));

  let ratingLabel;
  if (performanceScore >= 90) {
    ratingLabel = 'F1 Ready';
  } else if (performanceScore >= 75) {
    ratingLabel = 'Pro';
  } else if (performanceScore >= 55) {
    ratingLabel = 'Semi-Pro';
  } else if (performanceScore >= 35) {
    ratingLabel = 'Amateur';
  } else {
    ratingLabel = 'Rookie';
  }

  const strengths = [];
  const weaknesses = [];
  const tips = [];

  const s1Delta = userS1 - f1Sectors.s1;
  const s2Delta = userS2 - f1Sectors.s2;
  const s3Delta = userS3 - f1Sectors.s3;

  if (s1Delta < 300) {
    strengths.push('Strong Sector 1');
  } else if (s1Delta > 1000) {
    weaknesses.push('Sector 1 needs work');
  }

  if (s2Delta < 300) {
    strengths.push('Strong Sector 2');
  } else if (s2Delta > 1000) {
    weaknesses.push('Sector 2 needs work');
  }

  if (s3Delta < 300) {
    strengths.push('Strong Sector 3');
  } else if (s3Delta > 1000) {
    weaknesses.push('Sector 3 needs work');
  }

  if (pctFromF1Quali <= 3) {
    strengths.push('Exceptional pace');
    tips.push('Focus on consistency to maintain this level');
  } else if (pctFromF1Quali > 15) {
    weaknesses.push('Pace gap to F1');
    tips.push('Work on brake markers and corner entry');
  }

  if (platform === 'iracing') {
    tips.push('iRacing times are typically closest to real F1');
  } else if (platform === 'assetto-corsa') {
    tips.push('AC has slightly optimistic times - consider adding 1-2%');
  }

  if (tips.length < 3) {
    tips.push(`Target sector improvements of ${Math.abs(Math.round((s1Delta + s2Delta + s3Delta) / 3 / 100) * 100)}ms per sector`);
    tips.push('Practice qualifying runs to optimize tire preparation');
  }

  res.json({
    circuit,
    userTimeMs,
    f1RaceRecord: circuitData.f1RaceRecord,
    f1QualiRecord: circuitData.f1QualiRecord,
    f1AvgPace: circuitData.f1AvgPace,
    simWorldRecord: circuitData.simWorldRecord,
    pctFromF1Race: Math.round(pctFromF1Race * 100) / 100,
    pctFromF1Quali: Math.round(pctFromF1Quali * 100) / 100,
    sectorSplits: {
      s1: userS1,
      s2: userS2,
      s3: userS3
    },
    f1SectorBenchmarks: {
      s1: f1Sectors.s1,
      s2: f1Sectors.s2,
      s3: f1Sectors.s3
    },
    performanceScore,
    ratingLabel,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 2),
    tips: tips.slice(0, 3)
  });
});

export default router;
