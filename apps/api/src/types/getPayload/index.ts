import { NotificationGetPayload, ProductGetPayload } from '@/generated/prisma/models';

export type ProductWithThumbnail = ProductGetPayload<{ include: { thumbnail: true } }>;

export type NotificationWithTranslationsAndRecipients = NotificationGetPayload<{
  include: {
    translations: true;
    recipients: {
      include: {
        user: true;
      };
    };
  };
}>;
