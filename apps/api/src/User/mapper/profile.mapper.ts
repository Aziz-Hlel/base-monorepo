import { ProfileWithUser } from '../types';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedIdTokenWithClaims';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';
import { ProfileResponse } from '@contracts/schemas/profile/ProfileResponse';
import UserMapper from './user.mapper';
import { Profile } from '@/generated/prisma/client';

export class ProfileMapper {
  static toProfile(profile: Profile | null): ProfileResponse | null {
    if (!profile) return null;
    return {
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      avatar: profile.avatar,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
  static toUserProfileResponse(profile: ProfileWithUser, firebaseToken: DecodedIdTokenWithClaims): UserProfileResponse {
    const userResponse = UserMapper.toUserResponse(profile.user, firebaseToken.picture);
    const profileResponse = this.toProfile(profile);
    return { ...userResponse, profile: profileResponse };
  }

  static toProfileRowResponse(profile: Profile): ProfileResponse {
    return {
      phoneNumber: profile?.phoneNumber || null,
      address: profile?.address || null,
      avatar: profile?.avatar || null,
      createdAt: profile?.createdAt.toISOString() || '',
      updatedAt: profile?.updatedAt.toISOString() || '',
    };
  }
}
