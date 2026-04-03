import { prisma } from '@/bootstrap/db.init';
import { AccountRole } from '@/generated/prisma/enums';
import { AccountInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export class AccountRepo {
  isAccountExists = async ({ authId }: { authId: string }) => {
    const account = await prisma.account.findUnique({
      where: {
        authId,
      },
    });

    return !!account;
  };

  getAccountByAuthId = async <T extends AccountInclude<DefaultArgs>>({
    authId,
    include,
  }: {
    authId: string;
    include: T;
  }) => {
    const account = await prisma.account.findUnique({
      where: {
        authId,
      },
      include,
    });

    return account;
  };

  createAccount = async ({
    authId,
    email,
    role = AccountRole.USER,
    provider,
    isEmailVerified,
  }: {
    authId: string;
    email?: string;
    role?: AccountRole;
    provider: string;
    isEmailVerified?: boolean;
  }) => {
    const account = await prisma.account.create({
      data: {
        authId,
        email,
        role,
        provider,
        isEmailVerified: isEmailVerified ?? false,
      },
    });

    return account;
  };
}
