import z from 'zod';
import { ElectiveExamEnum } from '../../types/enums/enums';

export const createElectiveExamRequestSchema = z.object({
  name: z.enum(ElectiveExamEnum),
});

export type CreateElectiveExamRequest = z.infer<typeof createElectiveExamRequestSchema>;
