import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

prisma.$connect().then(() => {
  console.log('📊 Database connected');
}).catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
