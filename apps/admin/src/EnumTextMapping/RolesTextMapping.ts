import type { RoleEnum } from '@/Api/enums/RoleEnums';

const RolesTextMapping: Record<RoleEnum, string> = {
  ADMIN: 'Admin',
  USER: 'User',
};

export default RolesTextMapping;
