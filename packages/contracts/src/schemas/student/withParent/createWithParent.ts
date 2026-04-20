import z from 'zod';
import { createParentRequestSchema } from '../../parent/createParentRequest';
import { createStudentWithProfileRequestSchema } from '../createStudentWithProfile';

export const createStudentWithParentSchema = createStudentWithProfileRequestSchema.and(
  z.discriminatedUnion('type', [
    z.object({
      parent: createParentRequestSchema.and(z.object({ type: z.literal('NEW') })),
    }),
    z.object({
      parent: z.object({ type: z.literal('EXISTING'), id: z.uuid() }),
    }),
  ]),
);

export type CreateStudentWithParentRequest = z.infer<typeof createStudentWithParentSchema>;
