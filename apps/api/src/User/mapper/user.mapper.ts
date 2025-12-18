import { UserCreateInput } from '../../generated/prisma/models';
import { Role } from '../../generated/prisma/browser';
import { GenericEntityCreateInput } from '../../types/prisma/GenericEntityUtilityTypes';
import { User } from '../../generated/prisma/client';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Page } from '../../types/page/Page';
import { DefaultSearchParams } from '../../types/api/DefaultSeachParams';
import { UserProfileResponse } from '@contracts/types/user/UserProfileResponse';
import { UserRowResponse } from '@contracts/types/user/UserRowResponse';

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

  toUserResponseDto(user: User, firebaseToken: StrictDecodedIdToken): UserProfileResponse {
    const userResponse: UserProfileResponse = {
      id: user.id,
      email: user.email,
      authId: user.authId,
      username: user.username,
      provider: user.provider,
      status: user.status,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: firebaseToken.picture || null,
      createdAt: user.createdAt,
    };
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

  toUserPageResponse(users: User[], totalElements: number, queryParams: DefaultSearchParams): Page<UserRowResponse> {
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
