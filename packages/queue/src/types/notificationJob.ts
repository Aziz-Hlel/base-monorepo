export type LocalizedString = {
  en: string;
  ar?: string;
  fr?: string;
};

type NotificationRecipient =
  | {
      type: 'all';
    }
  | {
      type: 'country';
      countries: string[];
    }
  | {
      type: 'user';
      userIds: string[];
    };

type NotificationDate =
  | {
      type: 'delay';
      delayInSeconds?: number;
    }
  | {
      type: 'date';
      date: Date;
    };

export type NotificationJob = {
  titles: LocalizedString;
  contents: LocalizedString;
  data: LocalizedString;
  recipient: NotificationRecipient;
  date: NotificationDate;
};
