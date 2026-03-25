import z from 'zod';

export const notificationScheduleSchema = z.discriminatedUnion('scheduleType', [
  z.object({
    scheduleType: z.literal('DELAYED'),
    delaySeconds: z.number().int().positive(),
  }),
  z.object({
    scheduleType: z.literal('SCHEDULED'),
    scheduledAt: z.coerce.date().refine((date) => date > new Date(), 'Scheduled date must be in the future'),
  }),
]);

export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>;

export type NotificationScheduleResponse =
  | {
      scheduleType: 'DELAYED';
      delaySeconds: number;
    }
  | {
      scheduleType: 'SCHEDULED';
      scheduledAt: string;
    };
