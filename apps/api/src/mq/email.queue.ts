import redis from '@/bootstrap/redis.init';
import { Queue } from 'bullmq';

export const emailQueue = new Queue('emailQueue', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // retry up to 3 times
    backoff: { type: 'exponential', delay: 5000 }, // retry with exponential backoff
    removeOnComplete: true, // auto remove successful jobs
    removeOnFail: false, // keep failed jobs for inspection
  },
});
