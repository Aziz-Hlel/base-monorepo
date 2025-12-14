import { Role, Status } from "src/generated/prisma/enums";


export type UserResponseDto = {
  id: string;
  createdAt: Date;
  authId: string;
  email: string;
  provider: string;
  username: string | null;
  role: Role;
  isEmailVerified: boolean;
  status: Status;
  avatar?: string;
};
