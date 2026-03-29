import { prisma } from '@/bootstrap/db.init';
import { Notification, Prisma } from '@/generated/prisma/client';
import {
  NotificationOrderByWithRelationInput,
  NotificationTargetingCreateWithoutNotificationInput,
  NotificationWhereInput,
} from '@/generated/prisma/models';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';

export class NotificationRepo {
  private includeTranslations = () => {
    return {
      translations: true,
      targeting: {
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      },
      createdBy: true,
    } satisfies Prisma.NotificationInclude;
  };

  createTargetings = async (
    recipients: CreateNotificationRequest['recipients'],
  ): Promise<NotificationTargetingCreateWithoutNotificationInput> => {
    switch (recipients.type) {
      case 'ALL':
        return {};

      case 'COUNTRY':
        return { countries: recipients.countries };

      case 'ROLE':
        return { roles: recipients.roles };

      default:
        return { countries: [], roles: [] };
    }
  };

  createScheduleData = async (schedule: CreateNotificationRequest['schedule']) => {
    switch (schedule.scheduleType) {
      case 'DELAYED':
        return { delaySeconds: schedule.delaySeconds, scheduledAt: null };
      case 'SCHEDULED':
        return { delaySeconds: null, scheduledAt: schedule.scheduledAt };
      default:
        return { delaySeconds: null, scheduledAt: null };
    }
  };

  create = async (payload: CreateNotificationRequest): Promise<Notification> => {
    const targetings = await this.createTargetings(payload.recipients);
    const { delaySeconds, scheduledAt } = await this.createScheduleData(payload.schedule);

    const createdNotification = await prisma.notification.create({
      data: {
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
            // data: translation.data,
          })),
        },

        targeting: {
          create: targetings,
        },

        createdBy: {
          connect: {
            email: 'tigana137@gmail.com',
          },
        },
      },
      include: this.includeTranslations(),
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
      include: this.includeTranslations(),
    });
    const notificationsCount = prisma.notification.count({ where });

    const [content, totalElements] = await Promise.all([notifications, notificationsCount]);

    return { content, totalElements };
  };
}
