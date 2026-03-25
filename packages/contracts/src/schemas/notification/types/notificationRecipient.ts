import z from 'zod';
import { Role } from '../../../types/enums/enums';

export const notificationRecipientType = {
  ALL: 'ALL',
  COUNTRY: 'COUNTRY',
  ROLE: 'ROLE',
  USER: 'USER',
} as const;

export type NotificationRecipientType = (typeof notificationRecipientType)[keyof typeof notificationRecipientType];

export const notificationRecipientSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal(notificationRecipientType.ALL) }),
  z.object({ type: z.literal(notificationRecipientType.COUNTRY), countries: z.array(z.string()) }),
  z.object({
    type: z.literal(notificationRecipientType.ROLE),
    roles: z.array(z.enum(Object.values(Role).filter((role) => role !== 'USER'))),
  }),
  // z.object({ type: z.literal(notificationRecipientType.USER), userIds: z.array(z.uuid()) }),
]);

export type NotificationRecipient = z.infer<typeof notificationRecipientSchema>;
