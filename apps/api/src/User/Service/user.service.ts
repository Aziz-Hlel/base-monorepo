import { UserProfileRowResponse } from '@contracts/schemas/user/UserRowResponse';
import { UserOrderByWithRelationInput, UserWhereInput } from '../../generated/prisma/models';
import { prisma } from '../../bootstrap/db.init';
import { Page } from '../../types/page/Page';
import UserMapper from '../mapper/user.mapper';
import { UserPageQuery } from '@contracts/schemas/user/UserPageQuery';
import { cacheService } from '@/cache/service/cache.service';
import { CreateUserProfileRequest } from '@contracts/schemas/profile/createUserProfileRequest';
import { userRepo } from '../repo/user.repo';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { NotFoundError, PermissionDeniedError } from '@/err/customErrors';
import { Role } from '@/generated/prisma/enums';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';

class UserService {
  async getUserPage(queryParams: UserPageQuery): Promise<Page<UserProfileRowResponse>> {
    const cachedResult = await cacheService.get<Page<UserProfileRowResponse>>({ object: queryParams });
    if (cachedResult) {
      return cachedResult;
    }
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
    const orderBy: UserOrderByWithRelationInput = {
      [queryParams.sort]: queryParams.order,
    };

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

    await cacheService.set({ object: queryParams, value: userPage, ttlSeconds: 60 }); // Cache for 60 seconds

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
}

export const userService = new UserService();
