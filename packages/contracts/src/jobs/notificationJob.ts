import type { NotificationRecipient } from '../schemas/notification/types/notificationRecipient';
import type { NotificationSchedule } from '../schemas/notification/types/notificationSchedule';

export type LocalizedString = {
  en: string;
  ar?: string;
  fr?: string;
};

export type NotificationJob = {
  id: string;
  titles: LocalizedString;
  contents: LocalizedString;
  data: LocalizedString;
  recipients: NotificationRecipient;
  schedule: NotificationSchedule;
};
