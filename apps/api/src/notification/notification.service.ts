import { NotificationRecipientType, NotificationScheduleType, Role } from '@/generated/prisma/client';
import {
  NotificationGetPayload,
  NotificationOrderByWithRelationInput,
  NotificationWhereInput,
} from '@/generated/prisma/models';
import UserMapper from '@/modules/User/mapper/user.mapper';
import { INotificationQueue } from '@/mq/notification.queue';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationPageQuery } from '@repo/contracts/schemas/notification/notificationPageQuery';
import { NotificationResponse } from '@repo/contracts/schemas/notification/notificationResponse';
import { NotificationScheduleResponse } from '@repo/contracts/schemas/notification/types/notificationSchedule';
import { Page } from '@repo/contracts/types/page/Page';
import { NotificationHelper } from './notification.helper';
import { NotificationMapper } from './notification.mapper';
import { NotificationRepo } from './notification.repo';

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo,
    private readonly notificationQueue: INotificationQueue,
    private readonly notificationHelper: NotificationHelper,
  ) {}

  create = async (payload: CreateNotificationRequest) => {
    const createdNotification = await this.notificationRepo.create(payload);
    const notificationJob = await this.notificationHelper.createNotificationJob({
      payload,
      jobId: createdNotification.id,
    });

    await this.notificationQueue.add({
      payload: notificationJob,
      delay: NotificationMapper.toJobDelay(notificationJob.schedule),
    });
  };

  async getPage(queryParams: NotificationPageQuery): Promise<Page<NotificationResponse>> {
    const skip = (queryParams.page - 1) * queryParams.size;
    const take = queryParams.size;
    const { search } = queryParams;

    const where: NotificationWhereInput = {};

    if (search.length > 0) {
      const searchValue = search.toLowerCase();
      where.description = { contains: searchValue, mode: 'insensitive' };
    }

    // if (queryParams.status.length) {
    //   where.status = { in: queryParams.status };
    // }

    const orderBy: NotificationOrderByWithRelationInput = {};

    if (queryParams.sort) {
      orderBy[queryParams.sort] = queryParams.order;
    }

    const { content, totalElements } = await this.notificationRepo.getPage({ skip, take, where, orderBy });

    const notificationResponses: NotificationResponse[] = content.map((notification) => {
      return {
        id: notification.id,
        description: notification.description,

        payload: this.toPayloadResponse(notification),

        schedule: this.toScheduleResponse(notification),
        recipients: this.toRecipientResponse(notification),

        createdBy: UserMapper.toUserResponse(notification.createdBy),
        sentAt: notification.sentAt?.toISOString() ?? null,
        isSuccessful: null,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString(),
      };
    });

    const notificationPage = NotificationMapper.toNotificationPageResponse({
      content: notificationResponses,
      totalElements,
      pagination: queryParams,
    });

    return notificationPage;
  }

  toRecipientResponse(
    recipient: NotificationGetPayload<{ include: { targeting: true } }>,
  ): NotificationResponse['recipients'] {
    switch (recipient.recipientType) {
      case NotificationRecipientType.ALL:
        return {
          type: NotificationRecipientType.ALL,
        };
      case NotificationRecipientType.COUNTRY:
        return {
          type: NotificationRecipientType.COUNTRY,
          countries: recipient.targeting?.countries ?? [],
        };
      case NotificationRecipientType.ROLE:
        return {
          type: NotificationRecipientType.ROLE,
          roles:
            recipient.targeting?.roles && !recipient.targeting?.roles.includes(Role.USER)
              ? (recipient.targeting?.roles as Exclude<Role, 'USER'>[])
              : [],
        };
    }
    return {
      type: NotificationRecipientType.ALL,
    };
  }

  toPayloadResponse(
    payload: NotificationGetPayload<{
      include: {
        translations: true;
      };
    }>,
  ): CreateNotificationRequest['payload'] {
    return payload.translations.reduce(
      (acc, translation) => {
        acc[translation.language] = {
          language: translation.language,
          title: translation.title,
          content: translation.content,
          data: translation.data?.toString() ?? '',
        };
        return acc;
      },
      {} as CreateNotificationRequest['payload'],
    );
  }

  toScheduleResponse(
    schedule: NotificationGetPayload<{
      include: {
        translations: true;
      };
    }>,
  ): NotificationScheduleResponse {
    switch (schedule.scheduleType) {
      case NotificationScheduleType.SCHEDULED:
        return {
          scheduleType: NotificationScheduleType.SCHEDULED,
          scheduledAt: schedule.scheduledAt?.toISOString() ?? Date.now().toString(),
        };
      case NotificationScheduleType.DELAYED:
        return {
          scheduleType: NotificationScheduleType.DELAYED,
          delaySeconds: schedule.delaySeconds ?? 0,
        };
    }
  }
}
