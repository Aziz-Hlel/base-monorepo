import { AccountRole, UserRole } from '@/generated/prisma/client';
import z from 'zod';

export type NewAdminCustomClaims = {
  id: string;
  role: AccountRole;
};

export const claimsSchema = z.object({
  id: z.uuid(),
  role: z.enum(AccountRole),
});

export type Claims = z.infer<typeof claimsSchema>;
