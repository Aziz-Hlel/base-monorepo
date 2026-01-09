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

export type UserCreateInputCustom = GenericEntityCreateInput<UserCreateInput>;

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

  static toUserResponse(user: User, userAvatar?: string | null): UserResponse {
    return {
      id: user.id,
      email: user.email,
      authId: user.authId,
      username: user.username,
      provider: user.provider,
      status: user.status,
      userRole: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: userAvatar || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toUserProfileResponse(user: UserWithProfile, userAvatar: string | null): UserProfileResponse {
    const userResponse: UserResponse = this.toUserResponse(user, userAvatar);
    const profileResponse = ProfileMapper.toProfile(user.profile);
    const userProfileResponse: UserProfileResponse = {
      ...userResponse,
      profile: profileResponse,
    };
    return userProfileResponse;
  }

  static toUserProfileRowResponse(user: UserWithProfile): UserProfileRowResponse {
    const userRowResponse: UserRowResponse = {
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

    return { ...userRowResponse, profile: ProfileRowResponse };
  }

  static toUsersRowsResponse(users: UserWithProfile[]): UserProfileRowResponse[] {
    return users.map((user) => this.toUserProfileRowResponse(user));
  }

  static toUserPageResponse(params: {
    users: UserWithProfile[];
    totalElements: number;
    pagination: DefaultSearchParams;
  }): Page<UserProfileRowResponse> {
    const usersRows = this.toUsersRowsResponse(params.users);
    return {
      content: usersRows,
      pagination: {
        number: params.pagination.page,
        size: params.pagination.size,
        totalElements: params.totalElements,
        totalPages: Math.ceil(params.totalElements / params.pagination.size),
        offset: params.pagination.page * params.pagination.size,
        pageSize: params.users.length,
      },
    };
  }
}

export default UserMapper;
