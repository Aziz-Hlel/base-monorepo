import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { AccountRepo } from '../accounts/account.repo';
import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { AccountHelper } from '../accounts/account.helper';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/customErrors';
import { OwnerRepo } from './owner.repo';
import { UpdateOwnerRequest } from '@repo/contracts/schemas/owner/updateOwnerRequest';

export class OwnerService {
  constructor(
    private readonly ownerRepo: OwnerRepo,
    private readonly accountHelper: AccountHelper,
  ) {}

  create = async ({ schema, token }: { schema: CreateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    prisma.$transaction(async (tx) => {
      const accountHasOwner = await this.accountHelper.isAccountHasOwner({ accountId: token.claims.id, tx });
      if (accountHasOwner) {
        throw new ConflictError('Account already registered as school owner');
      }

      await this.ownerRepo.create({
        schema,
        accountId: token.claims.id,
        tx,
      });
    });
  };

  update = async ({ schema, token }: { schema: UpdateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    prisma.$transaction(async (tx) => {
      const accountHasOwner = await this.accountHelper.isAccountHasOwner({ accountId: token.claims.id, tx });
      if (accountHasOwner) {
        throw new ConflictError('Account already registered as school owner');
      }

      await this.ownerRepo.update({
        schema,
        accountId: token.claims.id,
        tx,
      });
    });
  };
}
