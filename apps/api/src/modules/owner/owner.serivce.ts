import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { OwnerRepo } from './owner.repo';
import { AccountHelper } from '../accounts/account.helper';

export class OwnerService {
  constructor(
    private readonly ownerRepo: OwnerRepo,
    private readonly accountHelper: AccountHelper,
  ) {}

  create = async ({ schema, accountId }: { schema: CreateOwnerRequest; accountId: string }) => {
    const owner = await this.ownerRepo.create({ schema, accountId });
    return owner;
  };

  findOrCreateOwner = async ({ schema, accountId }: { schema: CreateOwnerRequest; accountId: string }) => {
    const existingOwner = await this.ownerRepo.getOwnerByAccountId({ accountId });
    if (existingOwner) return { owner: existingOwner, type: 'EXISTING' };

    const owner = await this.ownerRepo.create({ schema, accountId });
    return { owner, type: 'NEW' };
  };
}
