import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationMapper } from './notification.mapper';
import { NotificationRepo } from './notification.repo';
import { INotificationQueue } from '@/mq/notification.queue';
import { NotificationResponse } from '@repo/contracts/schemas/notification/notificationResponse';
import { NotificationPageQuery } from '@repo/contracts/schemas/notification/notificationPageQuery';
import { NotificationOrderByWithRelationInput, NotificationWhereInput } from '@/generated/prisma/models';
import { Page } from '@repo/contracts/types/page/Page';

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo,
    private readonly notificationQueue: INotificationQueue,
  ) {}

  create = async (payload: CreateNotificationRequest) => {
    const createdNotification = await this.notificationRepo.create(payload);
    const notificationJob = NotificationMapper.toJob(payload, createdNotification.id);
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
      where.title = { contains: searchValue, mode: 'insensitive' };
    }

    // if (queryParams.status.length) {
    //   where.status = { in: queryParams.status };
    // }

    const orderBy: NotificationOrderByWithRelationInput = {};

    if (queryParams.sort) {
      orderBy[queryParams.sort] = queryParams.order;
    }

    const { content, totalElements } = await this.notificationRepo.getPage({ skip, take, where, orderBy });

    const notificationResponses = content.map(NotificationMapper.toRowResponse);

    const notificationPage = NotificationMapper.toNotificationPageResponse({
      content: notificationResponses,
      totalElements,
      pagination: queryParams,
    });

    return notificationPage;
  }
}
