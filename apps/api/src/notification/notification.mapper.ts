import { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationResponse } from '@repo/contracts/schemas/notification/notificationResponse';
import { NotificationSchedule } from '@repo/contracts/schemas/notification/types/notificationSchedule';
import { DefaultSearchParams } from '@repo/contracts/types/api/DefaultSeachParams';
import { Page } from '@repo/contracts/types/page/Page';

export class NotificationMapper {
  // static toJob(payload: CreateNotificationRequest, id: string): NotificationJob {
  //   return {
  //     id,
  //     titles: {
  //       en: payload.payload.en.title,
  //       ar: payload.payload.ar?.title,
  //       fr: payload.payload.fr?.title,
  //     },
  //     contents: {
  //       en: payload.payload.en.content,
  //       ar: payload.payload.ar?.content,
  //       fr: payload.payload.fr?.content,
  //     },
  //     data: {
  //       en: payload.payload.en.data,
  //       ar: payload.payload.ar?.data,
  //       fr: payload.payload.fr?.data,
  //     },
  //     targeting: payload.recipients,
  //     schedule: payload.schedule,
  //   };
  // }

  static toJobDelay = (schedule: NotificationSchedule) => {
    if (schedule.scheduleType === 'DELAYED') {
      return schedule.delaySeconds * 1000;
    }
    return schedule.scheduledAt.getTime() - Date.now();
  };

  static toNotificationPageResponse(params: {
    content: NotificationResponse[];
    totalElements: number;
    pagination: DefaultSearchParams;
  }): Page<NotificationResponse> {
    return {
      content: params.content,
      pagination: {
        number: params.pagination.page,
        size: params.pagination.size,
        totalElements: params.totalElements,
        totalPages: Math.ceil(params.totalElements / params.pagination.size),
        offset: params.pagination.page * params.pagination.size,
        pageSize: params.content.length,
      },
    };
  }
}
