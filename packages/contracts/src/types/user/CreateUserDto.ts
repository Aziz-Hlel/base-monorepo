import z from 'zod';
const CreateUserSchema = z.object({
  idToken: z.string({ error: 'tokenId is required' }).nonempty({ error: 'tokenId cannot be empty' }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema };
