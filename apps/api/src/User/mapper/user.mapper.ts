import { UserCreateInput } from '../../generated/prisma/models';
import { Role } from '../../generated/prisma/browser';
import { GenericEntityCreateInput } from '../../types/prisma/GenericEntityUtilityTypes';
import { User } from '../../generated/prisma/client';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Page } from '../../types/page/Page';
import { DefaultSearchParams } from '../../types/api/DefaultSearchParams';
import { UserResponse } from '@contracts/schemas/user/UserResponse';
import { ProfileRowResponse, UserProfileRowResponse, UserRowResponse } from '@contracts/schemas/user/UserRowResponse';
import { UserWithProfile } from '../types';
import { ProfileMapper } from './profile.mapper';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';
import { prisma } from '@/bootstrap/db.init';

type UserCreateInputCustom = GenericEntityCreateInput<UserCreateInput>;

class UserMapper {
  static toUserCreateInput(decodedToken: StrictDecodedIdToken): UserCreateInputCustom {
    const user: UserCreateInputCustom = {
      authId: decodedToken.uid,
      email: decodedToken.email as string,
      username: (decodedToken as any).name,
      provider: decodedToken.firebase.sign_in_provider,
      role: Role.USER,
      isEmailVerified: decodedToken.email_verified ?? false,
    };
    return user;
  }

  static async createUser(decodedToken: StrictDecodedIdToken): Promise<UserWithProfile> {
    const user = await prisma.user.create({
      data: this.toUserCreateInput(decodedToken),
    });
    return { ...user, profile: null };
  }

  static toUserResponse(user: User, firebaseToken: StrictDecodedIdToken): UserResponse {
    return {
      id: user.id,
      email: user.email,
      authId: user.authId,
      username: user.username,
      provider: user.provider,
      status: user.status,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: firebaseToken.picture ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toUserProfileResponse(user: UserWithProfile, firebaseToken: StrictDecodedIdToken): UserProfileResponse {
    const userResponse: UserResponse = this.toUserResponse(user, firebaseToken);
    const profileResponse = ProfileMapper.toProfile(user.profile);
    const userProfileResponse: UserProfileResponse = {
      ...userResponse,
      profile: profileResponse,
    };
    return userProfileResponse;
  }

  static toUserProfileRowResponse(user: UserWithProfile): UserProfileRowResponse {
    const UserRowResponse: UserRowResponse = {
      id: user.id,
      createdAt: user.createdAt,
      authId: user.authId,
      email: user.email,
      username: user.username,
      provider: user.provider,
      status: user.status,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const ProfileRowResponse: ProfileRowResponse | null = user.profile
      ? ProfileMapper.toProfileRowResponse(user.profile)
      : null;

    return { ...UserRowResponse, profile: ProfileRowResponse };
  }

  static toUsersRowsResponse(users: UserWithProfile[]): UserProfileRowResponse[] {
    return users.map((user) => this.toUserProfileRowResponse(user));
  }

  static toUserPageResponse(
    users: UserWithProfile[],
    totalElements: number,
    queryParams: DefaultSearchParams,
  ): Page<UserProfileRowResponse> {
    const usersRows = this.toUsersRowsResponse(users);
    return {
      content: usersRows,
      pagination: {
        number: queryParams.page,
        size: queryParams.size,
        totalElements,
        totalPages: Math.ceil(totalElements / queryParams.size),
        offset: queryParams.page * queryParams.size,
        pageSize: users.length,
      },
    };
  }
}

export default UserMapper;
