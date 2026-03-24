import ENV from '@/config/ENV';
import { IWorker } from '@/types/IWorker';
import QUEUE_NAMES from '@repo/contracts/const/queues.name';
import { Job, Worker } from 'bullmq';
import { EmailService } from './email.service';
import { EmailJob } from '@repo/contracts/jobs/emailJob';

export class EmailWorker implements IWorker<EmailJob> {
  constructor(private readonly emailService: EmailService) {
    this.createWorker();
  }
  private readonly workers: Worker<EmailJob>[] = [];

  handleJob = async (job: Job<EmailJob>) => {
    const data = job.data;
    await this.emailService.sendEmail(data);
  };

  createWorker = () => {
    const worker = new Worker(QUEUE_NAMES.email, this.handleJob, {
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
