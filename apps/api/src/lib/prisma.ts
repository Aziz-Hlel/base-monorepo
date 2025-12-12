import { PrismaPg } from '@prisma/adapter-pg';
import ENV from '../config/ENV';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = ENV.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
