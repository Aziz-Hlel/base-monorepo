import { NotificationQueue } from '@/mq/notification.queue';
import { NotificationController } from './notification.controller';
import { NotificationRepo } from './notification.repo';
import { NotificationService } from './notification.service';
import { createNotificationRouter } from './notification.route';
import { NotificationHelper } from './notification.helper';
import { UserRepo } from '@/modules/User/repo/user.repo';

export const createNotificationModule = ({ userRepo }: { userRepo: UserRepo }) => {
  const notificationQueue = new NotificationQueue();
  const notificationRepo = new NotificationRepo();
  const notificationHelper = new NotificationHelper(userRepo);
  const notificationService = new NotificationService(notificationRepo, notificationQueue, notificationHelper);
  const notificationController = new NotificationController(notificationService);
  const notificationRouter = createNotificationRouter(notificationController);
  return { notificationRouter };
};
