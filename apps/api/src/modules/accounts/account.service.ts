import { Account, AccountRole, Prisma } from '@/generated/prisma/client';
import { AccountHelper } from './account.helper';
import { AccountRepo } from './account.repo';
import { prisma } from '@/bootstrap/db.init';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { isUniqueConstraintError } from '@/utils/prismaError';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';

type FindOrCreateAccount = {
  accountDetails: {
    email: string;
    password?: string | null;
    displayName?: string;
    role?: AccountRole;
  };
  tx?: Prisma.TransactionClient;
};

export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepo,
    private readonly accountHelper: AccountHelper,
  ) {}

  createEmergencyAccount = async (token: DecodedIdTokenWithClaims) => {
    const account = await this.accountRepo.createAccount({
      authId: token.uid,
      email: token.email,
      role: token.claims.accountRole,
      provider: token.firebase.sign_in_provider,
      isEmailVerified: token.email_verified,
    });

    return account;
  };

  hasOwner = async (accountId: string) => {
    const account = await this.accountRepo.getById({ id: accountId, include: { owner: true } });
    return !!account?.owner;
  };

  findOrCreateAccount = async ({
    accountDetails,
  }: FindOrCreateAccount): Promise<{ account: Account; type: 'EXISTING' | 'NEW' }> => {
    const existingAccount = await prisma.account.findUnique({ where: { email: accountDetails.email } });

    if (existingAccount) return { account: existingAccount, type: 'EXISTING' };

    const authAccount = await firebaseUserService.findOrCreateAccount({
      email: accountDetails.email,
      password: accountDetails.password ?? '12345678',
      displayName: accountDetails.displayName,
    });

    try {
      const account = await this.accountRepo.createAccount({
        authId: authAccount.uid,
        email: accountDetails.email,
        role: accountDetails.role,
        provider: 'password',
        isEmailVerified: false,
      });

      // * it might throw errors and fuck up the flow
      await firebaseAuthService.setAccountClaims({
        authId: authAccount.uid,
        claims: {
          accountId: account.id,
          accountRole: account.role,
        },
      });
      return { account, type: 'NEW' };
    } catch (error: any) {
      if (isUniqueConstraintError(error)) {
        const existingAccount = await this.accountRepo.getAccountByEmail({
          email: accountDetails.email,
        });
        if (!existingAccount) throw error;
        return { account: existingAccount, type: 'EXISTING' };
      }

      throw error;
    }
  };
}
