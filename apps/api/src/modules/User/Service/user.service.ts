import { CreateUserRequest } from '@repo/contracts/schemas/user2/createUserRequest';
import { UserRepo } from '../repo/user.repo';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}
  findOrCreateSimpleUser = async ({
    payload,
    accountId,
    schoolId,
  }: {
    payload: CreateUserRequest;
    accountId: string;
    schoolId: string;
  }) => {
    const user = await this.userRepo.getUserByAccountIdSchoolId({
      accountId,
      schoolId,
    });
    if (user) {
      return { user, alreadyExists: true };
    }
    const createdUser = await this.userRepo.createUserWithSimpleRole({
      schema: payload,
      accountId,
      schoolId,
    });
    return { user: createdUser, alreadyExists: false };
  };
}
