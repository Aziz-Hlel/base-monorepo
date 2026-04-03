import z from 'zod';

export const createOwnerRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});

export type CreateOwnerRequest = z.infer<typeof createOwnerRequestSchema>;
