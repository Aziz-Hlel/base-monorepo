import z from 'zod';

export const assignElectiveExamToClassRequestSchema = z.object({
  classId: z.uuid(),
  electiveExamId: z.uuid(),
});

export type AssignElectiveExamToClassRequest = z.infer<typeof assignElectiveExamToClassRequestSchema>;
