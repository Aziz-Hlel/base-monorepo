import { Notification } from '@/generated/prisma/client';
import { NotificationWithTranslationsAndRecipients } from '@/types/getPayload';
import { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationResponse } from '@repo/contracts/schemas/notification/notificationResponse';
import { NotificationSchedule } from '@repo/contracts/schemas/notification/types/notificationSchedule';

export class NotificationMapper {
  static toJob(payload: CreateNotificationRequest, id: string): NotificationJob {
    return {
      id,
      titles: {
        en: payload.payload.en.title,
        ar: payload.payload.ar?.title,
        fr: payload.payload.fr?.title,
      },
      contents: {
        en: payload.payload.en.content,
        ar: payload.payload.ar?.content,
        fr: payload.payload.fr?.content,
      },
      data: {
        en: payload.payload.en.data,
        ar: payload.payload.ar?.data,
        fr: payload.payload.fr?.data,
      },
      recipients: payload.recipients,
      schedule: payload.schedule,
    };
  }

  static toJobDelay = (schedule: NotificationSchedule) => {
    if (schedule.scheduleType === 'DELAYED') {
      return schedule.delaySeconds * 1000;
    }
    return schedule.scheduledAt.getTime() - Date.now();
  };

  static toRecipients(recipients: NotificationWithTranslationsAndRecipients): NotificationResponse['recipients'] {
    if (recipients.recipientType === 'ALL') return { type: 'ALL' };
    if (recipients.recipientType === 'COUNTRY') return { type: 'COUNTRY', countries: recipients.recipients[0].country };
    if (recipients.recipientType === 'ROLE')
      return { type: 'ROLE', userIds: recipients.recipients.map((recipient) => recipient.user.id) };
    if (recipients.recipientType === 'USER')
      return { type: 'USER', userIds: recipients.recipients.map((recipient) => recipient.user.id) };
  }

  static toRowResponse(notifications: NotificationWithTranslationsAndRecipients): NotificationResponse {
    return {
      id: notifications.id,
      title: notifications.title,
      description: notifications.description,
      recipients: notifications.recipientType,
      scheduleType: notifications.scheduleType,
      delaySeconds: notifications.delaySeconds,
      scheduledAt: notifications.scheduledAt,

      createdAt: notifications.createdAt.toISOString(),
      updatedAt: notifications.updatedAt.toISOString(),
    };
  }
}
