import { NotificationQueue } from '@/mq/notification.queue';
import { NotificationController } from './notification.controller';
import { NotificationRepo } from './notification.repo';
import { NotificationService } from './notification.service';
import { createNotificationRouter } from './notification.route';

export const createNotificationModule = () => {
  const notificationRepo = new NotificationRepo();
  const notificationQueue = new NotificationQueue();
  const notificationService = new NotificationService(notificationRepo, notificationQueue);
  const notificationController = new NotificationController(notificationService);
  const notificationRouter = createNotificationRouter(notificationController);
  return { notificationRouter };
};
