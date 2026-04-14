import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createUserRequest';
import { UserRepo } from './user.repo';
import { ConflictError } from '@/err/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  createSimpleUser = async (
    params: { payload: CreateSimpleUserRequest; accountId: string; schoolId: string },
    tx?: TX,
  ) => {
    const { payload, accountId, schoolId } = params;
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    if (user) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `User with email ${payload.email} already exists in school ${schoolId}`,
      });
    }
    const createdUser = await this.userRepo.createUserWithSimpleRole({ schema: payload, accountId, schoolId }, tx);
    return createdUser;
  };

  findOrCreateSimpleUser = async (params: {
    payload: CreateSimpleUserRequest;
    accountId: string;
    schoolId: string;
  }) => {
    const { payload, accountId, schoolId } = params;
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    if (user) {
      return { user, alreadyExists: true };
    }
    const createdUser = await this.userRepo.createUserWithSimpleRole({ schema: payload, accountId, schoolId });
    return { user: createdUser, alreadyExists: false };
  };

  findByAccountId = async ({ accountId, schoolId }: { accountId: string; schoolId: string }) => {
    const user = await this.userRepo.findByAccountIdSchoolId({ accountId, schoolId });
    return user;
  };

  getById = async (userId: string) => {
    const user = await this.userRepo.findById(userId, {
      include: { roles: true, account: true, parent: true, teacher: true },
    });
    return user;
  };
}
