import { Router } from 'express';
import axios from 'axios';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const chatRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionKey: z.number().optional(),
});

const RACE_CONTEXT = `You are a helpful F1 race engineer assistant. You provide insights about:
- Race strategy and tyre management
- Overtaking opportunities and probabilities
- Pit stop timing recommendations
- Driver performance analysis
- Weather impact on races
- Championship implications

Be concise, informative, and passionate about Formula 1.`;

chatRouter.post('/', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { message, sessionKey } = chatSchema.parse(req.body);
  
  await prisma.chatMessage.create({
    data: { userId: req.userId!, role: 'user', content: message },
  });
  
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({
      response: "AI chat is currently unavailable. Please configure the ANTHROPIC_API_KEY in the backend .env file.",
    });
  }
  
  const systemPrompt = sessionKey
    ? `${RACE_CONTEXT}\n\nCurrent session: ${sessionKey}\nYou have access to real-time race data through the OpenF1 API.`
    : RACE_CONTEXT;
  
  const response = await axios.post(
    process.env.ANTHROPIC_API_URL!,
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    }
  );
  
  const aiResponse = response.data.content[0].text;
  
  await prisma.chatMessage.create({
    data: { userId: req.userId!, role: 'assistant', content: aiResponse },
  });
  
  res.json({ response: aiResponse });
}));

chatRouter.get('/history', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const messages = await prisma.chatMessage.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  res.json({ messages });
}));

chatRouter.delete('/history', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  await prisma.chatMessage.deleteMany({
    where: { userId: req.userId },
  });
  res.json({ success: true });
}));
