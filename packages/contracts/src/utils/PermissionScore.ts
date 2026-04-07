import { Role } from '../types/enums/enums';

const PERMISSION_SCORE: Record<Role, number> = {
  SUPER_ADMIN: 2,
  ADMIN: 1,
};
export default PERMISSION_SCORE;
