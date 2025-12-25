import { Role } from '../types/enums/enums';

const PERMISSION_SCORE: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  STAFF: 2,
  USER: 1,
};
export default PERMISSION_SCORE;
