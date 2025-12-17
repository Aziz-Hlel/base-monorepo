import type { Role, Status } from "../enums/enums";

export type UserRowResponse = {
  id: string;
  createdAt: Date;
  authId: string;
  email: string;
  provider: string;
  username: string | null;
  role: Role;
  isEmailVerified: boolean;
  status: Status;
};
