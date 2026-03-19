// apps/worker-email/src/index.ts
import { Worker, Job } from 'bullmq';
import { EmailJob } from '@repo/queue/types/emailJob';
import ENV from '@/config/ENV';
import { emailProvider } from './email.provider';

const createEmailWorker = () => {
  const worker = new Worker(
    'emailQueue',
    async (job: Job<EmailJob>) => {
      const data = job.data;

      await emailProvider.sendEmail(data);
    },

    {
      connection: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
        password: ENV.REDIS_PASSWORD,
      },
      concurrency: 5,
    },
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed`, err);
  });

  return worker;
};

export default createEmailWorker;
