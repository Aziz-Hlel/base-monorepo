import { AccountRole } from '@/generated/prisma/enums';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AccountRepo } from './account.repo';
import { Prisma } from '@/generated/prisma/client';

export class AccountHelper {
  constructor(private readonly accountRepo: AccountRepo) {}

  createEmergencyAccount = async (authProviderToken: DecodedIdToken) => {
    const account = await this.accountRepo.createAccount({
      authId: authProviderToken.uid,
      email: authProviderToken.email,
      role: authProviderToken.role,
      provider: authProviderToken.firebase.sign_in_provider,
      isEmailVerified: authProviderToken.email_verified,
    });

    return account;
  };

  createAdminAccount = async (authProviderToken: DecodedIdToken) => {
    const account = await this.accountRepo.createAccount({
      authId: authProviderToken.uid,
      email: authProviderToken.email,
      role: AccountRole.ADMIN,
      provider: authProviderToken.firebase.sign_in_provider,
      isEmailVerified: authProviderToken.email_verified,
    });
    return account;
  };

  isAccountHasOwner = async ({ accountId, tx }: { accountId: string; tx: Prisma.TransactionClient }) => {
    const account = await tx.account.findUnique({
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
