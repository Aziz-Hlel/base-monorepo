import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/customErrors';
import { AccountService } from '@/modules/accounts/account.serivce';
import { CreateUserRequest } from '@repo/contracts/schemas/user2/createUserRequest';
import { UserRepo } from '../repo/user.repo';
import { UserService } from './user.service';

type CreateUserParams = {
  payload: CreateUserRequest;
  schoolId: string;
};

export interface IUserService {
  createUser: (data: CreateUserParams) => Promise<{ message: string; accountExists: boolean }>;
}

export class UserAppService implements IUserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  async createUser({ payload, schoolId }: CreateUserParams) {
    const { account, type: accountType } = await this.accountService.findOrCreateAccount({
      accountDetails: {
        email: payload.email,
        password: payload.password,
        displayName: `${payload.firstName} ${payload.lastName}`,
      },
    });

    const { user, alreadyExists } = await this.userService.findOrCreateSimpleUser({
      payload,
      accountId: account.id,
      schoolId,
    });
    if (alreadyExists) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `User with email ${payload.email} already exists in school ${schoolId}`,
      });
    }
    return {
      message: 'User created successfully',
      user: { id: user.id },
      accountExists: accountType === 'EXISTING',
    };
  }
}
