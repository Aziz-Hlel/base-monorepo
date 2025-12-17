import type { Page } from '@/types/page/Page';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { UserRowResponse } from '@/types/user/UserRowResponse';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<UserRowResponse>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),
};

export default userService;
