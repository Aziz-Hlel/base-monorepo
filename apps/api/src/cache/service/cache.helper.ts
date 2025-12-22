import { UserPageQuery } from '@contracts/schemas/user/UserPageQuery';

export class CacheHelper {
  normalizeUserPageParams(params: UserPageQuery): UserPageQuery {
    return {
      ...params,
      role: params.role.sort(),
      status: params.status.sort(),
    };
  }
}
