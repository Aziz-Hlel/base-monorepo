import { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
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
}
