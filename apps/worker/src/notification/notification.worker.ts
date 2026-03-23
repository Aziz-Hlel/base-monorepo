import { IWorker } from '@/types/IWorker';
import { NotificationService } from './notification.service';
import { Job, Worker } from 'bullmq';
import ENV from '@/config/ENV';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import { NotificationJob } from '@repo/contracts/jobs/notificationJob';

export class NotificationWorker implements IWorker<NotificationJob> {
  constructor(private readonly notificationService: NotificationService) {}
  private readonly workers: Worker<NotificationJob>[] = [];

  handleJob = async (job: Job<NotificationJob>) => {
    const data = job.data;
    await this.notificationService.sendNotification(data);
  };

  createWorker = () => {
    const worker = new Worker(QUEUE_NAMES.notification, this.handleJob, {
      connection: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
        password: ENV.REDIS_PASSWORD,
      },
      concurrency: 5,
    });

    worker.on('completed', (job) => {
      console.log(`✅ Job id: ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job id: ${job?.id} failed`, err);
    });

    this.workers.push(worker);
  };

  close = async () => {
    await Promise.all(this.workers.map((w) => w.close()));
  };

  getWorkers = () => {
    return this.workers;
  };
}
