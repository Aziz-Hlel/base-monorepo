import type { UserResponse } from '../user/UserResponse';
import type { CreateNotificationRequest } from './createNotification';
import type { NotificationRecipient } from './types/notificationRecipient';
import type { NotificationScheduleResponse } from './types/notificationSchedule';

export type NotificationResponse = {
  id: string;
  description: string | null;
  recipients: NotificationRecipient;
  payload: CreateNotificationRequest['payload'];
  schedule: NotificationScheduleResponse;
  isSuccessful: boolean | null;
  createdBy: UserResponse;
  createdAt: string;
  updatedAt: string;
};
