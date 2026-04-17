import z from 'zod';
import { createUserV2Schema } from '../user/v2/createUserSchema';

export const createParentRequestSchema = createUserV2Schema.extend({
  emergencyPhone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .or(z.literal(''))
    .or(z.null())
    .transform((val) => (val === '' ? null : val)),
});

export type CreateParentRequest = z.infer<typeof createParentRequestSchema>;
