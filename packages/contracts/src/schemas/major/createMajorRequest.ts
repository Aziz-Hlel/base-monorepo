import z from 'zod';
import { MajorEnum } from '../../types/enums/enums';

export const createMajorRequest = z.object({
  name: z.enum(MajorEnum),
});

export type CreateMajorRequest = z.infer<typeof createMajorRequest>;
