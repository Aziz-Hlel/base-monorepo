import { prisma } from '../db.init';
import { logger } from '../logger.init';

export const testDbConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ SUCCESS : Database connected successfully!');
  } catch (error) {
    logger.error('❌ ERROR : Database connection failed.');
    throw error;
  }
};
