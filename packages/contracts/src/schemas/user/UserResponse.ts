import { Role, Status } from '../../types/enums/enums';

export type UserResponse = {
  id: string;
  authId: string;
  email: string | null;
  provider: string;
  username: string | null;
  userRole: Role;
  isEmailVerified: boolean;
  status: Status;
  avatar: string | null;

  createdAt: string;
  updatedAt: string;
};
