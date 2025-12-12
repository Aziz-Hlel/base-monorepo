import { Role, Status } from '../enums/all';

type Exact<T, Shape extends T = T> = Shape & Record<Exclude<keyof Shape, keyof T>, never>;

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
