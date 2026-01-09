import { Role, Status } from '../../types/enums/enums';
import { Prettify } from '../../utils/Prettify';

export type UserRowResponse = {
  id: string;
  createdAt: Date;
  authId: string;
  email: string | null;
  provider: string;
  username: string | null;
  role: Role;
  isEmailVerified: boolean;
  status: Status;
};

export type ProfileRowResponse = {
  phoneNumber: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};
type UserProfileRowResponseNotPretty = UserRowResponse & { profile: ProfileRowResponse | null };

export type UserProfileRowResponse = Prettify<UserProfileRowResponseNotPretty>;
