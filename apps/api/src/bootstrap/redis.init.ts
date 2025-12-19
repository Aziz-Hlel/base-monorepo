import ENV from '@/config/ENV';
import Redis from 'ioredis';

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
    console.log('✅ SUCCESS : Redis connected successfully.');
  } catch (err) {
    console.error('❌ ERROR : Redis connection failed', err);
    process.exit(1);
  }
}
export default redis;

redis.on('error', (err) => {
  console.error('❌ ERROR : Redis error', err);
});

redis.on('warning', (warning) => {
  console.warn('⚠️ WARNING : Redis warning', warning);
});
