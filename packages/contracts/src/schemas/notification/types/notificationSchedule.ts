import z from 'zod';

export const notificationScheduleSchema = z.discriminatedUnion('scheduleType', [
  z.object({
    scheduleType: z.literal('DELAYED'),
    delaySeconds: z.number().int().positive(),
  }),
  z.object({
    scheduleType: z.literal('SCHEDULED'),
    scheduledAt: z.date(),
  }),
]);

export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>;
