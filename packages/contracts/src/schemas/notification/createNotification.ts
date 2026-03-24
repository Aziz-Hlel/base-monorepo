import z from 'zod';
import { notificationRecipientSchema } from './types/notificationRecipient';
import { notificationScheduleSchema } from './types/notificationSchedule';
import { optionalLanguagesSchema, TranslationSchema } from './types/languagePayload';

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  recipients: notificationRecipientSchema,
  payload: z.object({ en: TranslationSchema }).extend(optionalLanguagesSchema.shape),
  schedule: notificationScheduleSchema,
});

export type CreateNotificationRequest = z.infer<typeof createNotificationSchema>;
