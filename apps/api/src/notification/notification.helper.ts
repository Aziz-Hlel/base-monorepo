import { CreateNotificationRequest } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationJob } from '@repo/contracts/jobs/notificationJob';
import { UserRepo } from '@/modules/User/user.repo';

export class NotificationHelper {
  constructor(private readonly userRepo: UserRepo) {}

  private createTargetingJob = async (
    recipients: CreateNotificationRequest['recipients'],
  ): Promise<NotificationJob['targeting']> => {
    switch (recipients.type) {
      case 'ALL':
        return { type: 'ALL' };

      case 'COUNTRY':
        return { type: 'COUNTRY', countries: recipients.countries };

      case 'ROLE':
        const users = await this.userRepo.getUsersByRole(recipients.roles);
        return { type: 'ROLE', userIds: users.map((user) => user.id) };

      default:
        return { type: 'ALL' };
    }
  };

  private toNotificationTitles = (payload: CreateNotificationRequest['payload']): NotificationJob['titles'] => {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value.title]),
    ) as NotificationJob['titles']; // * you're forcing the type , i dont like that
  };

  private toNotificationContents = (payload: CreateNotificationRequest['payload']): NotificationJob['contents'] => {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value.content]),
    ) as NotificationJob['contents'];
  };

  private toNotificationData = (payload: CreateNotificationRequest['payload']): NotificationJob['data'] => {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value.data]),
    ) as NotificationJob['data'];
  };

  createNotificationJob = async ({
    payload,
    jobId,
  }: {
    payload: CreateNotificationRequest;
    jobId: string;
  }): Promise<NotificationJob> => {
    const targeting = await this.createTargetingJob(payload.recipients);
    const titles = this.toNotificationTitles(payload.payload);
    const contents = this.toNotificationContents(payload.payload);
    const data = this.toNotificationData(payload.payload);

    const job: NotificationJob = {
      id: jobId,
      schedule: payload.schedule,
      targeting: targeting,
      titles: titles,
      contents: contents,
      data: data,
    };

    return job;
  };
}
