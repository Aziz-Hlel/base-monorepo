import z from 'zod';

export const createClassRequestSchema = z.object({
  name: z.string().trim().nonempty('Class name is required').max(255, 'Class name must be at most 255 characters long'),
});

export type CreateClassRequest = z.infer<typeof createClassRequestSchema>;
