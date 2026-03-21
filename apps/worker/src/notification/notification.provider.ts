import ENV from '@/config/ENV';
import { LocalizedString, NotificationJob } from '@repo/queue/types/notificationJob';
import axios from 'axios';

interface INotificationProvider {
  send(payload: NotificationJob): Promise<void>;
}

type OneSignalPayload = {
  app_id: string;
  target_channel: string;
  headings: LocalizedString;
  data: LocalizedString;
  contents: LocalizedString;
  included_segments?: string[];
  include_external_user_ids?: string[];
  send_after?: Date;
  filters?: {
    field: 'country';
    relation: '=';
    value: string;
  }[];
};

type BaseNotificationPayload = {
  app_id: string;
  target_channel: string;
  headings: LocalizedString;
  data: LocalizedString;
  contents: LocalizedString;
};

class NotificationProvider implements INotificationProvider {
  private oneSignalUrl = 'https://onesignal.com/api/v1/notifications';

  sendToAllUsers(baseNotificationPayload: BaseNotificationPayload): OneSignalPayload[] {
    return [
      {
        ...baseNotificationPayload,
        included_segments: ['All'],
      },
    ];
  }
  sendToCountry(baseNotificationPayload: BaseNotificationPayload, countries: string[]): OneSignalPayload[] {
    return countries.map((country) => {
      return {
        ...baseNotificationPayload,
        filters: [
          {
            field: 'country',
            relation: '=',
            value: country,
          },
        ],
      };
    });
  }
  sendToUser(baseNotificationPayload: BaseNotificationPayload, userIds: string[]): OneSignalPayload[] {
    const userBatches = [];
    for (let i = 0; i < userIds.length; i += 1000) {
      userBatches.push(userIds.slice(i, i + 1000));
    }
    return userBatches.map((userBatch) => {
      return {
        ...baseNotificationPayload,
        include_external_user_ids: userBatch,
      };
    });
  }
  async send(payload: NotificationJob) {
    const baseNotificationPayload = {
      app_id: ENV.ONE_SIGNAL_APP_ID,
      target_channel: 'push',
      headings: payload.titles,
      data: payload.data,
      contents: payload.contents,
    };

    let payloads: OneSignalPayload[];
    switch (payload.recipient.type) {
      case 'all':
        payloads = this.sendToAllUsers(baseNotificationPayload);
        break;
      case 'country':
        payloads = this.sendToCountry(baseNotificationPayload, payload.recipient.countries);
        break;
      case 'user':
        payloads = this.sendToUser(baseNotificationPayload, payload.recipient.userIds);
        break;
    }

    await Promise.all(payloads.map(this.sendNotification));
  }

  async sendNotification(payload: OneSignalPayload) {
    try {
      await axios.post(this.oneSignalUrl, payload, {
        headers: {
          Authorization: `Bearer ${ENV.ONE_SIGNAL_APP_SECRET}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('❌ ERROR : Notification job failed', error);
      throw error;
    }
  }
}

export const notificationProvider = new NotificationProvider();
