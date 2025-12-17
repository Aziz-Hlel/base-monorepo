import type { Role } from '@/types/enums/enums';

const RolesTextMapping: Record<Role, string> = {
  ADMIN: 'Admin',
  USER: 'User',
  STAFF: 'Staff',
  SUPER_ADMIN: 'Super Admin',
};

export default RolesTextMapping;
