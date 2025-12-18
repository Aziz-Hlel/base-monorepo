import { UserRowResponse } from '@contracts/types/user/UserRowResponse';
import { UnauthorizedError } from '../../err/customErrors';
import { UserOrderByWithRelationInput, UserWhereInput } from '../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { Page } from '../../types/page/Page';
import UserMapper from '../mapper/user.mapper';
import { defaultQuery, UserPageQuery } from '@/types/user/UserPageQuery';

class UserService {
  GeneralQuery() {}

  async getUserPage(queryParams: UserPageQuery): Promise<Page<UserRowResponse>> {
    // throw new UnauthorizedError('Not implemented yet');
    console.log('queryparam: ', queryParams);
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

    return userPage;
  }
}

export const userService = new UserService();
