import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const userRouter = Router();

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
});

const createBetSchema = z.object({
  sessionKey: z.number(),
  market: z.string(),
  driverNumber: z.number(),
  odds: z.number(),
  stake: z.number(),
});

const createFantasyTeamSchema = z.object({
  sessionKey: z.number(),
  drivers: z.array(z.number()),
  budget: z.number().optional(),
});

const createPredictionSchema = z.object({
  sessionKey: z.number(),
  pole: z.number(),
  p2: z.number(),
  p3: z.number(),
  fastestLap: z.number(),
  dnf1: z.number(),
  dnf2: z.number(),
});

userRouter.get('/profile', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      username: true,
      pitcoins: true,
      createdAt: true,
      _count: {
        select: { bets: true, fantasyTeams: true, predictions: true },
      },
    },
  });
  res.json({ user });
}));

userRouter.patch('/profile', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { username } = updateProfileSchema.parse(req.body);
  
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { username },
    select: { id: true, email: true, username: true, pitcoins: true },
  });
  res.json({ user });
}));

userRouter.get('/fantasy-teams', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const teams = await prisma.fantasyTeam.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ teams });
}));

userRouter.post('/fantasy-teams', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const data = createFantasyTeamSchema.parse(req.body);
  
  const existingTeam = await prisma.fantasyTeam.findFirst({
    where: { userId: req.userId, sessionKey: data.sessionKey },
  });
  
  if (existingTeam) {
    const team = await prisma.fantasyTeam.update({
      where: { id: existingTeam.id },
      data: { drivers: JSON.stringify(data.drivers), budget: data.budget },
    });
    return res.json({ team });
  }
  
  const team = await prisma.fantasyTeam.create({
    data: {
      userId: req.userId!,
      sessionKey: data.sessionKey,
      drivers: JSON.stringify(data.drivers),
      budget: data.budget || 100.0,
    },
  });
  res.status(201).json({ team });
}));

userRouter.get('/bets', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const bets = await prisma.bet.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ bets });
}));

userRouter.post('/bets', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const data = createBetSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  
  if (!user || user.pitcoins < data.stake) {
    return res.status(400).json({ error: 'Insufficient pitcoins' });
  }
  
  await prisma.user.update({
    where: { id: req.userId },
    data: { pitcoins: { decrement: data.stake } },
  });
  
  const bet = await prisma.bet.create({
    data: { userId: req.userId!, ...data },
  });
  
  res.status(201).json({ bet, pitcoins: user.pitcoins - data.stake });
}));

userRouter.get('/predictions', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const predictions = await prisma.prediction.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ predictions });
}));

userRouter.post('/predictions', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const data = createPredictionSchema.parse(req.body);
  
  const existingPrediction = await prisma.prediction.findFirst({
    where: { userId: req.userId, sessionKey: data.sessionKey },
  });
  
  if (existingPrediction) {
    const prediction = await prisma.prediction.update({
      where: { id: existingPrediction.id },
      data,
    });
    return res.json({ prediction });
  }
  
  const prediction = await prisma.prediction.create({
    data: { userId: req.userId!, ...data },
  });
  res.status(201).json({ prediction });
}));

userRouter.get('/chat-history', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const messages = await prisma.chatMessage.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  res.json({ messages });
}));
