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
  logger.debug({ query: 'e.query', duration: e.duration }, 'Prisma query');
});

prisma.$on('error', (e) => {
  logger.error({ target: e.target, message: e.message }, 'Prisma error');
});

prisma.$on('warn', (e) => {
  logger.warn({ target: e.target, message: e.message }, 'Prisma warning');
});

export { prisma };
