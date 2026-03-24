import { NotificationProvider } from './notification.provider';
import { NotificationJob } from '@repo/contracts/jobs/notificationJob';

export class NotificationService {
  constructor(private readonly notificationProvider: NotificationProvider) {}
  async sendNotification(payload: NotificationJob) {
    await this.notificationProvider.send(payload);
  }
}
