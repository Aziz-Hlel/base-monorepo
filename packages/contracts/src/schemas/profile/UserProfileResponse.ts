import { UserResponse } from '../user/UserResponse';
import { ProfileResponse } from './ProfileResponse';

export type UserProfileResponse = UserResponse & { profile: ProfileResponse | null };
