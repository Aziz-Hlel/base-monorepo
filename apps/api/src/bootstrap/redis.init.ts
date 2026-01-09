import ENV from '@/config/ENV';
import Redis from 'ioredis';
import { logger } from './logger.init';

const redis = new Redis({
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  password: ENV.REDIS_PASSWORD,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

export async function connectRedis() {
  if (redis.status === 'ready') return;

  try {
    await redis.connect();
    logger.info('✅ SUCCESS : Redis connected successfully.');
  } catch (err) {
    logger.error(err, '❌ ERROR : Redis connection failed');
    process.exit(1);
  }
}
export default redis;

redis.on('error', (err) => {
  logger.error(err, '❌ ERROR : Redis error');
});

redis.on('warning', (warning) => {
  logger.warn(warning, '⚠️ WARNING : Redis warning');
});
