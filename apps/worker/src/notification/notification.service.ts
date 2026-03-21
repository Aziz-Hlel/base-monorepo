import { NotificationJob } from '@repo/queue/types/notificationJob';
import { notificationProvider } from './notification.provider';

class NotificationService {
  async sendNotification(payload: NotificationJob) {
    await notificationProvider.send(payload);
  }
}

export const notificationService = new NotificationService();
