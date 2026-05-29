import z from 'zod';
import { CapacityTypeEnum } from '../../types/enums/enums';

export const createSchoolCapStatRequestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(CapacityTypeEnum.MAJOR),
    majorId: z.uuid(),
    nbrClasses: z.number().int(),
  }),
  z.object({
    type: z.literal(CapacityTypeEnum.ELECTIVE),
    examId: z.uuid(),
    nbrClasses: z.number().int(),
  }),
]);

export type CreateSchoolCapStatRequest = z.infer<typeof createSchoolCapStatRequestSchema>;
