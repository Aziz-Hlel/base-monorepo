import type { Page } from '@contracts/types/page/Page';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { UserRowResponse } from '@contracts/types/user/UserRowResponse';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<UserRowResponse>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),
};

export default userService;
