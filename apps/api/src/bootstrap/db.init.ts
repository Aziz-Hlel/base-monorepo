import { PrismaPg } from '@prisma/adapter-pg';
import ENV from '../config/ENV';
import { PrismaClient } from '../generated/prisma/client';
import { logger } from './logger.init';

const connectionString = ENV.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  const durationInMs = e.duration;

  if (durationInMs < 1000) {
    const durationFixed = durationInMs.toFixed(2);
    const durationMsg = `${durationFixed} ms`;
    return;
    return logger.debug({ duration: durationMsg }, 'Prisma query');
  }
  if (durationInMs >= 1000 && durationInMs < 3000) {
    const durationFixed = (durationInMs / 1000).toFixed(2);
    const durationMsg = `${durationFixed} s`;
    return logger.warn({ query: e.query, duration: durationMsg }, 'Prisma query slow');
  }

  const durationFixed = (durationInMs / 1000).toFixed(2);
  const durationMsg = `${durationFixed} s`;
  return logger.error({ query: e.query, duration: durationMsg }, 'Prisma query very slow');
});

prisma.$on('error', (e) => {
  logger.error({ target: e.target, message: e.message }, 'Prisma error');
});

prisma.$on('warn', (e) => {
  logger.warn({ target: e.target, message: e.message }, 'Prisma warning');
});

export { prisma };
