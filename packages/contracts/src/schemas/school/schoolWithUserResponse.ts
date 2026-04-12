import type { UserResponse } from '../user/UserResponse';
import type { SchoolResponse } from './schoolResponse';

export type SchoolWithUserResponse = UserResponse & {
  school: SchoolResponse;
};
