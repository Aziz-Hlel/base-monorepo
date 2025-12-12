import { UnauthorizedError } from '../../err/customErrors';
import { UserWhereInput } from '../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { Page } from '../../types/page/Page';
import UserMapper from '../mapper/user.mapper';
import { UserPageQuery, UserPageQuerySortFields } from '../schema/UserPageQuery';
import { UserRowResponse } from '../schema/UserRowResponse';

class UserService {
  GeneralQuery() {}

  async getUserPage(queryParams: UserPageQuery): Promise<Page<UserRowResponse>> {
    // throw new UnauthorizedError('Not implemented yet');
    const skip = queryParams.page * queryParams.size;
    const take = queryParams.size;
    const { search } = queryParams;
    const where: UserWhereInput = {};

    if (search && search.trim()) {
      const searchValue = search.toLowerCase();

      where.OR = [
        { username: { contains: searchValue, mode: 'insensitive' } },
        { email: { contains: searchValue, mode: 'insensitive' } },
      ];
    }

    const orderBy = {
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
