import { UserCreateInput } from '@/generated/prisma/models';
import { UserInternalService } from '@/modules/User/Service/user.internal.service';

export class UserSeedService {
  constructor(private readonly userService: UserInternalService) {}

  run = async (userData: UserCreateInput) => {
    const { user } = await this.userService.findOrCreateUser(userData);
    return user;
  };
}
