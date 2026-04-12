import { UserCreateInput } from '@/generated/prisma/models';
import { UserService } from '@/modules/User/Service/user.service';

export class UserSeedService {
  constructor(private readonly userService: UserService) {}

  run = async (userData: UserCreateInput) => {
    const { user } = await this.userService.findOrCreateUser(userData);
    return user;
  };
}
