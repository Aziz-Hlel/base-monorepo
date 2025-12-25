import { Role } from '@/generated/prisma/enums';

export type CustomClaims = {
  id: string;
  role: Role;
};
