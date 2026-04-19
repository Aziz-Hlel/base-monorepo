import z from 'zod';

export const assignExamToClassesRequestSchema = z.object({
  classIds: z.array(z.uuid()),
  examId: z.uuid(),
});

export type AssignExamToClassesRequest = z.infer<typeof assignExamToClassesRequestSchema>;
