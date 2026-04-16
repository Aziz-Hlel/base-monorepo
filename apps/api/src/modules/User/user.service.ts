import { UserRepo } from './user.repo';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { UserInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateUserInput } from './types/createUserInput';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  createSimpleUser = async (params: { payload: CreateUserInput; accountId: string; schoolId: string }, tx?: TX) => {
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

  updateSimpleUser = async ({
    input,
    userId,
    schoolId,
  }: {
    input: UpdateSimpleUserRequest;
    userId: string;
    schoolId: string;
  }) => {
    const user = await this.userRepo.findById(userId, { include: {} });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'User not found',
        internalLog: `User with id ${userId} exists but not in school ${schoolId}`,
      });
    }
    const updatedUser = await this.userRepo.updateSimpleUser({ input, userId });
    return updatedUser;
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

  findById = async <T extends UserInclude<DefaultArgs>>(
    userId: string,
    { include }: { include: T } = { include: {} as T },
  ) => {
    const user = await this.userRepo.findById(userId, {
      include,
    });
    return user;
  };
}
