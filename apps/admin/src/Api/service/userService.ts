import type { Page } from '@contracts/types/page/Page';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { UserRowResponse } from '@contracts/schemas/user/UserRowResponse';
import type { CreateUserProfileRequest } from '@contracts/schemas/profile/createUserProfileRequest';
import type { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<UserRowResponse>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),

  createUserProfile: async (payload: CreateUserProfileRequest) => {
    return apiService.postThrowable<UserProfileResponse>(apiRoutes.users.createUserProfile(), payload);
  },

  deleteUserProfile: async (id: string) => {
    return apiService.deleteThrowable<void>(apiRoutes.users.deleteUserProfile(id));
  },

  disableUser: async (id: string) => {
    return apiService.deleteThrowable<void>(apiRoutes.users.disableUser(id));
  },
};

export default userService;
