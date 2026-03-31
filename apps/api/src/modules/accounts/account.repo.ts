import { prisma } from '@/bootstrap/db.init';
import { AccountInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export class AccountRepo {
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
}
