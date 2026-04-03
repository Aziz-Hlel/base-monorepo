import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
import { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { UpdateOwnerRequest } from '@repo/contracts/schemas/owner/updateOwnerRequest';

export class OwnerRepo {
  create = async ({
    schema,
    accountId,
    tx,
  }: {
    schema: CreateOwnerRequest;
    accountId: string;
    tx?: Prisma.TransactionClient;
  }) => {
    const orm = tx ?? prisma;
    const owner = await orm.owner.create({
      data: {
        ...schema,
        accountId,
      },
    });
    return owner;
  };

  update = async ({
    schema,
    accountId,
    tx,
  }: {
    schema: UpdateOwnerRequest;
    accountId: string;
    tx?: Prisma.TransactionClient;
  }) => {
    const orm = tx ?? prisma;
    const owner = await orm.owner.update({
      where: {
        accountId,
      },
      data: {
        ...schema,
      },
    });
    return owner;
  };
}
