import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
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

  getById = async <T extends AccountInclude<DefaultArgs>>({ id, include }: { id: string; include: T }) => {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
      include,
    });

    return account;
  };

  hasOwner = async ({ accountId }: { accountId: string }) => {
    const exists = await prisma.account.findFirst({
      where: {
        id: accountId,
        owner: { isNot: null },
      },
      select: { id: true },
    });

    return !!exists;
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

  getAccountByEmail = async ({ email, tx }: { email: string; tx?: Prisma.TransactionClient }) => {
    const orm = tx || prisma;
    const account = await orm.account.findUnique({
      where: {
        email,
      },
    });

    return account;
  };
}
