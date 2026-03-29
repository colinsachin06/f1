import express from 'express';
import cors from 'cors';
import driversRouter from './routes/drivers.js';
import constructorsRouter from './routes/constructors.js';
import circuitsRouter from './routes/circuits.js';
import simRouter from './routes/sim.js';
import predictionsRouter from './routes/predictions.js';
import sentimentRouter from './routes/sentiment.js';
import fantasyRouter from './routes/fantasy.js';
import radioRouter from './routes/radio.js';
import telemetryRouter from './routes/telemetry.js';
import leaguesRouter from './routes/leagues.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/drivers', driversRouter);
app.use('/api/constructors', constructorsRouter);
app.use('/api/circuits', circuitsRouter);
app.use('/api/sim', simRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/sentiment', sentimentRouter);
app.use('/api/fantasy', fantasyRouter);
app.use('/api/radio', radioRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/leagues', leaguesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
