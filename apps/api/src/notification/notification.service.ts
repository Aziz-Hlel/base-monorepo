import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationMapper } from './notification.mapper';
import { NotificationRepo } from './notification.repo';
import { INotificationQueue } from '@/mq/notification.queue';

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo,
    private readonly notificationQueue: INotificationQueue,
  ) {}
  create = async (payload: CreateNotificationRequest) => {
    const createdNotification = await this.notificationRepo.create(payload);
    const notificationJob = NotificationMapper.toJob(payload, createdNotification.id);
    await this.notificationQueue.add({
      payload: notificationJob,
      delay: NotificationMapper.toJobDelay(notificationJob.schedule),
    });
  };
}
