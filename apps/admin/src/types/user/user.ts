import RoleEnums from '@/Api/enums/RoleEnums';
import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().max(255).optional(),
  email: z.email().max(255),
  role: z.enum(Object.values(RoleEnums)),
  avatar: z.url().optional(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

