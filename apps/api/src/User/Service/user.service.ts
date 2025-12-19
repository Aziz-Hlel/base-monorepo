import { UserRowResponse } from '@contracts/types/user/UserRowResponse';
import { UserOrderByWithRelationInput, UserWhereInput } from '../../generated/prisma/models';
import { prisma } from '../../bootstrap/db.init';
import { Page } from '../../types/page/Page';
import UserMapper from '../mapper/user.mapper';
import { UserPageQuery } from '@contracts/types/user/UserPageQuery';
import { cacheService } from '@/cache/service/cache.service';

class UserService {
  GeneralQuery() {}

  async getUserPage(queryParams: UserPageQuery): Promise<Page<UserRowResponse>> {
    const cachedResult = await cacheService.get<Page<UserRowResponse>>({ object: queryParams });
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
    });

    const usersCount = prisma.user.count({ where });

    const [content, totalElements] = await Promise.all([usersContent, usersCount]);

    const userPage = UserMapper.toUserPageResponse(content, totalElements, queryParams);

    await cacheService.set({ object: queryParams, value: userPage, ttlSeconds: 60 }); // Cache for 60 seconds

    return userPage;
  }
}

export const userService = new UserService();
