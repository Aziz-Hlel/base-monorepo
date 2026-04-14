import { prisma } from '@/bootstrap/db.init';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { Account, AccountRole, Prisma } from '@/generated/prisma/client';
import { accountInclude } from '@/types/includes/account';
import { isUniqueConstraintError } from '@/utils/prismaError';
import { AccountHelper } from './account.helper';
import { AccountRepo } from './account.repo';
import { DatabaseError } from '@/err/customErrors';

type FindOrCreateAccount = {
  accountDetails: {
    email: string;
    password?: string | null;
    displayName?: string;
    role?: AccountRole;
    provider?: string;
  };
  tx?: Prisma.TransactionClient;
};

type FindOrCreateAccount_V2 = {
  accountDetails: {
    email: string;
    authId: string;
    role?: AccountRole;
    provider?: string;
  };
  tx?: Prisma.TransactionClient;
};
export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepo,
    private readonly accountHelper: AccountHelper,
  ) {}

  create = async (params: {
    uid: string;
    email: string | undefined;
    role?: AccountRole;
    provider?: string;
    isEmailVerified?: boolean;
  }) => {
    const account = await this.accountRepo.createAccount({
      authId: params.uid,
      email: params.email,
      role: params.role,
      provider: params.provider,
      isEmailVerified: params.isEmailVerified,
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

    const { userRecord, type } = await firebaseUserService.findOrCreateAccount({
      email: accountDetails.email,
      password: accountDetails.password ?? '12345678',
      displayName: accountDetails.displayName,
    });

    try {
      const account = await this.accountRepo.createAccount({
        authId: userRecord.uid,
        email: accountDetails.email,
        role: accountDetails.role,
        provider: accountDetails.provider ?? 'password',
        isEmailVerified: false,
      });

      // * it might throw errors and fuck up the flow
      await firebaseAuthService.setAccountClaims({
        authId: userRecord.uid,
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

  findOrCreateAccount_V2 = async (
    { accountDetails }: FindOrCreateAccount_V2,
    tx?: Prisma.TransactionClient,
  ): Promise<{ account: Account; type: 'EXISTING' | 'NEW' }> => {
    const client = tx ?? prisma;

    const existingAccount = await client.account.findUnique({ where: { email: accountDetails.email } });

    if (existingAccount) return { account: existingAccount, type: 'EXISTING' };

    try {
      const account = await this.accountRepo.createAccount(
        {
          authId: accountDetails.authId,
          email: accountDetails.email,
          role: accountDetails.role,
          provider: accountDetails.provider,
          isEmailVerified: false,
        },
        tx,
      );

      return { account, type: 'NEW' };
    } catch (error: any) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to create account', cause: error });
    }
  };

  findByAuthId = async (authId: string) => {
    const account = await this.accountRepo.findByAuthId({ authId, include: accountInclude });
    return account;
  };

  findByAuthIdWithAllGraph = async (authId: string) => {
    const account = await this.accountRepo.findByAuthId({ authId, include: accountInclude });
    return account;
  };
}
