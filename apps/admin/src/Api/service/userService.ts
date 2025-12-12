import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { Page } from '@/types/page/Page';
import type { UserRowResponse } from '@/types/user/UserRow';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number }) =>
    apiService.getThrowable<Page<UserRowResponse>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),
};

export default userService;
