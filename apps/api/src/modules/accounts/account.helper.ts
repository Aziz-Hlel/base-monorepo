import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
import { AccountRepo } from './account.repo';

export class AccountHelper {
  constructor(private readonly accountRepo: AccountRepo) {}

  isAccountHasOwner = async ({ accountId, tx }: { accountId: string; tx?: Prisma.TransactionClient }) => {
    const orm = tx || prisma;
    const account = await orm.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        owner: true,
      },
    });

    return !!account?.owner;
  };
}
