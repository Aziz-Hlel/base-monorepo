import type { UserResponse } from '../user/UserResponse';
import type { ProfileResponse } from './ProfileResponse';

export type UserProfileResponse = UserResponse & { profile: ProfileResponse | null };
