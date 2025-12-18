import { Role, Status } from '../enums/enums';

export type UserProfileResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  authId: string;
  email: string;
  provider: string;
  username: string | null;
  role: Role;
  isEmailVerified: boolean;
  status: Status;
  avatar?: string;
};
