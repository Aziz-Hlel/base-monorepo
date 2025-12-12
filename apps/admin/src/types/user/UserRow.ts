import type { RoleEnum } from "@/Api/enums/RoleEnums";
import type { StatusEnum } from "@/Api/enums/StatusEnums";

export type UserRowResponse = {
  createdAt: Date;
  id: string;
  authId: string;
  email: string;
  provider: string;
  username: string | null;
  role: RoleEnum;
  isEmailVerified: boolean;
  status: StatusEnum;
};
