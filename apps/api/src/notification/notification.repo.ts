import { prisma } from '@/bootstrap/db.init';
import { Notification } from '@/generated/prisma/client';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';

export class NotificationRepo {
  private includeTranslations = { translations: true };

  create = async (payload: CreateNotificationRequest): Promise<Notification> => {
    const delaySeconds = payload.schedule.scheduleType === 'DELAYED' ? payload.schedule.delaySeconds : null;
    const scheduledAt = payload.schedule.scheduleType === 'SCHEDULED' ? payload.schedule.scheduledAt : null;
    const createdNotification = await prisma.notification.create({
      data: {
        title: payload.title,
        description: payload.description,
        recipientType: payload.recipients.type,
        scheduleType: payload.schedule.scheduleType,
        delaySeconds: delaySeconds,
        scheduledAt: scheduledAt,
        translations: {
          create: Object.values(payload.payload).map((translation) => ({
            language: translation.language,
            title: translation.title,
            content: translation.content,
            data: translation.data,
          })),
        },
      },
      include: this.includeTranslations,
    });
    return createdNotification;
  };
}
