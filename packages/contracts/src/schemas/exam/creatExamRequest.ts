import z from 'zod';
import { SubjectEnum, TermEnum, TimeOfDayEnum } from '../../types/enums/enums';
import { isDateOnly } from '../../utils/isDateOnly';
import { isTime } from '../../utils/isTime';

const baseSchema = z.object({
  subject: z.enum(SubjectEnum),
  date: z.string().refine(isDateOnly, 'Invalid date format'),
  startTime: z.string().refine(isTime, 'Invalid time format'),
  endTime: z.string().refine(isTime, 'Invalid time format'),
  timeOfDay: z.enum(TimeOfDayEnum),
  term: z.enum(TermEnum),
});

const optionalPart = z.discriminatedUnion('isOptional', [
  z.object({
    isOptional: z.literal(true),
  }),
  z.object({
    isOptional: z.literal(false),
    majorId: z.uuid(),
  }),
]);

export const createExamRequestSchema = baseSchema.and(optionalPart);

export type CreateExamRequest = z.infer<typeof createExamRequestSchema>;
