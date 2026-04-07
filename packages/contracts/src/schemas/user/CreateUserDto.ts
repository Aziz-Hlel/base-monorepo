import z from 'zod';
const CreateUserSchema = z.object({
  token: z.string({ error: 'token is required' }).nonempty({ error: 'token cannot be empty' }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema };
