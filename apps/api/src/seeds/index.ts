import { logger } from '@/bootstrap/logger.init';
import ENV from '../config/ENV';
import seedUsers from './fakes/users.fake';

const seed = async () => {
  if (ENV.NODE_ENV === 'production') {
    logger.info('ℹ️ NOTE : Skipped seeding in production environment.');
    return;
  }
  const userSeed = seedUsers(50);

  try {
    await Promise.all([userSeed]);
  } catch (error) {
    logger.error(error, '❌ ERROR : Seeding failed.');
    throw error;
  }
  logger.info('✅ SUCCESS : Seeding completed.');
};

export default seed;
