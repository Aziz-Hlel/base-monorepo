import { prisma } from '@/bootstrap/db.init';
import { Notification, Prisma } from '@/generated/prisma/client';
import { NotificationOrderByWithRelationInput, NotificationWhereInput } from '@/generated/prisma/models';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationPageQuery } from '@repo/contracts/schemas/notification/notificationPageQuery';

export class NotificationRepo {
  private includeTranslations = {
    translations: true,
    recipients: {
      include: {
        user: true,
      },
    },
  } satisfies Prisma.NotificationInclude;

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

  getPage = async ({
    skip,
    take,
    where,
    orderBy,
  }: {
    skip: number;
    take: number;
    where: NotificationWhereInput;
    orderBy: NotificationOrderByWithRelationInput;
  }) => {
    const notifications = prisma.notification.findMany({
      skip,
      take,
      where,
      orderBy,
      include: this.includeTranslations,
    });
    const notificationsCount = prisma.notification.count({ where });

    const [content, totalElements] = await Promise.all([notifications, notificationsCount]);

    return { content, totalElements };
  };
}
