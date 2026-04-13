import z from 'zod';
import { simpleUserRoles } from '../../types/enums/meta/userRoleMeta';

export const GrantSimpleRoleRequestSchema = z.object({
  role: z.enum(simpleUserRoles, { error: 'Invalid role' }),
});

export type GrantSimpleRoleRequest = z.infer<typeof GrantSimpleRoleRequestSchema>;
