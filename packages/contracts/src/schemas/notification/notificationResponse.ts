import type { CreateNotificationRequest } from './createNotification';
import type { NotificationRecipient } from './types/notificationRecipient';
import type { NotificationSchedule } from './types/notificationSchedule';

export type NotificationResponse = {
  id: string;
  title: string;
  description: string | null;
  recipients: NotificationRecipient;
  payload: CreateNotificationRequest['payload'];
  schedule: NotificationSchedule;
  success: boolean | null;
  createdAt: string;
  updatedAt: string;
};
