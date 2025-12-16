import { Role, Status } from '../enums';

export type UserResponseDto = {
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
