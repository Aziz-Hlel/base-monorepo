import { UserCreateInput } from '@/generated/prisma/models';
import { UserRepo } from '../repo/user.repo';

export class UserInternalService {
  constructor(private readonly userRepo: UserRepo) {}

  async isUserEmailExists(email: string) {
    return await this.userRepo.isUserEmailExists(email);
  }

  async createUser(user: UserCreateInput) {
    return await this.userRepo.createUser(user);
  }

  async getUserById(id: string) {
    return await this.userRepo.getUserById(id);
  }

  async getUserByAuthId(authId: string) {
    return await this.userRepo.getUserByAuthId(authId);
  }
}
