import { Role, Status } from "..";

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
