import { NotificationProvider } from './notification.provider';
import { NotificationService } from './notification.service';
import { NotificationWorker } from './notification.worker';

export const initNotification = async () => {
  const notificationProvider = await new NotificationProvider();
  const notificationService = new NotificationService(notificationProvider);
  const notificationWorker = new NotificationWorker(notificationService);
  notificationWorker.createWorker();
  return {
    workers: notificationWorker.getWorkers(),
  };
};
