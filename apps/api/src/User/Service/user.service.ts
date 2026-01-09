import { UserProfileRowResponse } from '@contracts/schemas/user/UserRowResponse';
import { UserOrderByWithRelationInput, UserWhereInput } from '../../generated/prisma/models';
import { prisma } from '../../bootstrap/db.init';
import { Page } from '../../types/page/Page';
import UserMapper from '../mapper/user.mapper';
import {
  ProfileKeys,
  profileLevelSortableFields,
  RootKeys,
  rootLevelSortableFields,
  UserPageQuery,
} from '@contracts/schemas/user/UserPageQuery';
import { cacheService } from '@/cache/service/cache.service';
import { CreateUserProfileRequest } from '@contracts/schemas/profile/createUserProfileRequest';
import { userRepo } from '../repo/user.repo';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { NotFoundError, PermissionDeniedError } from '@/err/customErrors';
import { Role } from '@/generated/prisma/enums';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import { UpdateUserProfileRequest } from '@contracts/schemas/profile/updateUserProfileRequest';
import { logger } from '@/bootstrap/logger.init';
import { RedisKeys } from '@/cache/keys/cache.keys';

class UserService {
  async getUserPage(queryParams: UserPageQuery): Promise<Page<UserProfileRowResponse>> {
    const cachedKey = RedisKeys.usersPage.genKey(queryParams);
    const cachedResult = await cacheService.get<Page<UserProfileRowResponse>>({ key: cachedKey });
    if (cachedResult) {
      logger.debug('[Cache hit:UserService] Returning cached user page');
      return cachedResult;
    }
    logger.debug('[Cache miss:UserService] Returning cached user page');
    const skip = (queryParams.page - 1) * queryParams.size;
    const take = queryParams.size;
    const { search } = queryParams;
    const where: UserWhereInput = {};

    if (search.length > 0) {
      const searchValue = search.toLowerCase();
      where.OR = [
        { username: { contains: searchValue, mode: 'insensitive' } },
        { email: { contains: searchValue, mode: 'insensitive' } },
      ];
    }
    where.AND = [];
    if (queryParams.status.length) {
      where.AND.push({
        status: { in: queryParams.status },
      });
    }
    if (queryParams.role.length) {
      where.AND.push({
        role: { in: queryParams.role },
      });
    }

    const orderBy: UserOrderByWithRelationInput = {};

    if (rootLevelSortableFields.includes(queryParams.sort as RootKeys)) {
      orderBy[queryParams.sort as keyof UserOrderByWithRelationInput] = queryParams.order;
    }
    if (profileLevelSortableFields.includes(queryParams.sort as ProfileKeys)) {
      orderBy['profile'] = {
        [queryParams.sort]: queryParams.order,
      };
    }

    const usersContent = prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { profile: true },
    });

    const usersCount = prisma.user.count({ where });

    const [content, totalElements] = await Promise.all([usersContent, usersCount]);

    const userPage = UserMapper.toUserPageResponse({
      users: content,
      totalElements,
      pagination: queryParams,
    });

    await cacheService.set({ key: cachedKey, value: userPage, ttlSeconds: 60 }); // Cache for 60 seconds

    return userPage;
  }

  async createUserProfile(schema: CreateUserProfileRequest): Promise<UserProfileResponse> {
    const userRecord = await firebaseUserService.createUser({
      email: schema.email,
      password: schema.password,
      displayName: schema.username,
      role: schema.role,
    });

    const user = await userRepo.createUserProfile(schema, userRecord.uid);

    const userProfileResponse = UserMapper.toUserProfileResponse(user, null);
    return userProfileResponse;
  }

  async updateUserProfile(
    id: string,
    data: UpdateUserProfileRequest,
    currentUserRole: Role,
  ): Promise<UserProfileResponse> {
    const user = await userRepo.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPermitted = PERMISSION_SCORE[currentUserRole] >= PERMISSION_SCORE[user.role];
    if (!isPermitted) {
      throw new PermissionDeniedError('You do not have permission to update this user');
    }

    const updatedUser = await userRepo.updateUserProfile(id, data);
    const userProfileResponse = UserMapper.toUserProfileResponse(updatedUser, null);
    return userProfileResponse;
  }

  async deleteUser(userToDeleteId: string, currentUserRole: Role): Promise<void> {
    const user = await userRepo.getUserById(userToDeleteId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (PERMISSION_SCORE[currentUserRole] < PERMISSION_SCORE[user.role]) {
      throw new PermissionDeniedError('You do not have permission to delete this user');
    }

    await firebaseUserService.deleteUser(user.authId);
    await userRepo.deleteUser(userToDeleteId);
  }

  async disableUser(userId: string, currentUserRole: Role): Promise<void> {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (PERMISSION_SCORE[currentUserRole] < PERMISSION_SCORE[user.role]) {
      throw new PermissionDeniedError('You do not have permission to delete this user');
    }

    await firebaseUserService.disableUser(user.authId);
    await userRepo.disableUser(userId);
  }

  async enableUser(userId: string, currentUserRole: Role): Promise<void> {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (PERMISSION_SCORE[currentUserRole] < PERMISSION_SCORE[user.role]) {
      throw new PermissionDeniedError('You do not have permission to enable this user');
    }

    await firebaseUserService.enableUser(user.authId);
    await userRepo.enableUser(userId);
  }
}

export const userService = new UserService();
