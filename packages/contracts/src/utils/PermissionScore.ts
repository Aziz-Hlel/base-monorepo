import { AccountRole } from '../types/enums/enums';

const PERMISSION_SCORE: Record<AccountRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  USER: 1,
};
export default PERMISSION_SCORE;
