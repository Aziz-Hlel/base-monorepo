import { ConflictError } from '@/err/customErrors';
import { AccountService } from '@/modules/accounts/account.service';
import { CreateUserRequest } from '@repo/contracts/schemas/user2/createUserRequest';
import { UserService } from './user.service';

type CreateUserParams = {
  payload: CreateUserRequest;
  schoolId: string;
};

export class UserAppService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
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
