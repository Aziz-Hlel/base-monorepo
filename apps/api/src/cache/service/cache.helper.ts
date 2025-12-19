import { UserPageQuery } from '@contracts/types/user/UserPageQuery';

export class CacheHelper {
  normalizeUserPageParams(params: UserPageQuery): UserPageQuery {
    return {
      ...params,
      role: params.role.sort(),
      status: params.status.sort(),
    };
  }
}
