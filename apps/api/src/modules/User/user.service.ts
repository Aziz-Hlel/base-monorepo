import { CreateUserRequest } from '@repo/contracts/schemas/user/createUserRequest';
import { UserRepo } from './user.repo';

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
    const user = await this.userRepo.findByAccountIdSchoolId({
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

  findByAccountId = async ({ accountId, schoolId }: { accountId: string; schoolId: string }) => {
    const user = await this.userRepo.findByAccountIdSchoolId({
      accountId,
      schoolId,
    });
    return user;
  };

  getById = async (userId: string) => {
    const user = await this.userRepo.findById(userId, {
      include: {
        roles: true,
        account: true,
        parent: true,
        teacher: true,
      },
    });
    return user;
  };
}
