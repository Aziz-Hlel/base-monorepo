import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { AccountHelper } from '../accounts/account.helper';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/customErrors';
import { OwnerRepo } from './owner.repo';
import { UpdateOwnerRequest } from '@repo/contracts/schemas/owner/updateOwnerRequest';
import { OwnerService } from './owner.serivce';

export class OwnerAppService {
  constructor(
    private readonly ownerRepo: OwnerRepo,
    private readonly accountHelper: AccountHelper,
    private readonly ownerService: OwnerService,
  ) {}

  create = async ({ schema, token }: { schema: CreateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    await prisma.$transaction(async (tx) => {
      const accountHasOwner = await this.accountHelper.isAccountHasOwner({ accountId: token.claims.accountId, tx });
      if (accountHasOwner) {
        throw new ConflictError('Account already registered as school owner');
      }
      await this.ownerService.create({ schema, accountId: token.claims.accountId });

      return {
        message: 'Owner created successfully',
      };
    });
  };

  update = async ({ schema, token }: { schema: UpdateOwnerRequest; token: DecodedIdTokenWithClaims }) => {
    await prisma.$transaction(async (tx) => {
      const accountHasOwner = await this.accountHelper.isAccountHasOwner({ accountId: token.claims.accountId, tx });
      if (!accountHasOwner) {
        throw new ConflictError('Account not registered as school owner');
      }

      await this.ownerRepo.update({
        schema,
        accountId: token.claims.accountId,
        tx,
      });
    });
  };
}
