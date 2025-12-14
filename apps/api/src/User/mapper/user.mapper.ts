import type { UserCreateInput } from '../../generated/prisma/models';
import { Role } from '../../generated/prisma/browser';
import type { GenericEntityCreateInput } from '../../types/prisma/GenericEntityUtilityTypes';
import type { UserResponseDto } from '../schema/UserResponseDto';
import type { User } from '../../generated/prisma/client';
import type { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import type { UserRowResponse } from '../schema/UserRowResponse';
import type { Page } from '../../types/page/Page';
import type { DefaultSearchParams } from '../../types/api/DefaultSeachParams';
import type { UserPageQuery } from '../schema';

type UserCreateInputCustom = GenericEntityCreateInput<UserCreateInput>;

const UserMapper = {
  toUserCreateInput(decodedToken: StrictDecodedIdToken): UserCreateInputCustom {
    const user: UserCreateInputCustom = {
      authId: decodedToken.uid,
      email: decodedToken.email as string,
      username: (decodedToken as any).name,
      provider: decodedToken.firebase.sign_in_provider,
      role: Role.USER,
      isEmailVerified: decodedToken.email_verified ?? false,
    };
    return user;
  },

  toUserResponseDto(user: User, firebaseToken: StrictDecodedIdToken): UserResponseDto {
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      authId: user.authId,
      username: user.username,
      provider: user.provider,
      status: user.status,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
    firebaseToken.picture && (userResponse.avatar = firebaseToken.picture);
    return userResponse;
  },

  toUserRowResponse(user: User): UserRowResponse {
    const userRow: UserRowResponse = {
      id: user.id,
      email: user.email,
      authId: user.authId,
      username: user.username,
      provider: user.provider,
      status: user.status,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
    return userRow;
  },

  toUsersRowsResponse(users: User[]): UserRowResponse[] {
    return users.map((user) => this.toUserRowResponse(user));
  },

  toUserPageResponse(users: User[], totalElements: number, queryParams: UserPageQuery): Page<UserRowResponse> {
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
  },
};

export default UserMapper;
