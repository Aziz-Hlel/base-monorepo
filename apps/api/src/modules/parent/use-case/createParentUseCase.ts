import { AccountRole, UserRole } from '@/generated/prisma/enums';
import { AccountService } from '@/modules/accounts/account.service';
import { UserService } from '@/modules/User/user.service';
import { UserRoleRepo } from '@/modules/userRoles/userRole.repo';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateParentRequest } from '@repo/contracts/schemas/parent/createParentRequest';
import { ParentRepo } from '../parent.repo';
import { prisma } from '@/bootstrap/db.init';

export class CreateParentUseCase {
  constructor(
    private readonly parentRepo: ParentRepo,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly userRoleRepo: UserRoleRepo,
  ) {}

  private run = async (params: { input: CreateParentRequest; schoolId: string; authId: string }, tx: TX) => {
    const { input, schoolId, authId } = params;
    const { account } = await this.accountService.findOrCreateAccount_V2(
      {
        accountDetails: {
          email: input.email,
          authId: authId,
          role: AccountRole.USER,
        },
      },
      tx,
    );

    const user = await this.userService.create_V2({ input, schoolId, accountId: account.id }, tx);

    await this.userRoleRepo.grantRole_V2({ userId: user.id, role: UserRole.PARENT }, tx);

    return user;
  };

  execute = async (params: { input: CreateParentRequest; schoolId: string; authId: string }, tx?: TX) => {
    if (tx) return await this.run(params, tx);

    return await prisma.$transaction((tx) => {
      return this.run(params, tx);
    });
  };
}
