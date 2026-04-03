import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
import { CreateSchoolPayload } from './types/createSchoolPayload';
import { ConflictError } from '@/err/customErrors';
import { isUniqueConstraintError } from '@/utils/prismaError';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { logger } from '@/bootstrap/logger.init';

export class SchoolRepo {
  create = async ({
    payload,
    ownerId,
    tx,
  }: {
    payload: CreateSchoolPayload;
    ownerId: string;
    tx?: Prisma.TransactionClient;
  }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.create({
        data: {
          ...payload,
          ownerId,
        },
      });

      return school;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (isUniqueConstraintError(error)) {
          throw new ConflictError({
            message: 'School already exists',
            clientDisplayMessage: 'School already exists',
            cause: error,
          });
        }
      }
      throw error;
    }
  };

  update = async ({
    payload,
    schoolId,
    tx,
  }: {
    payload: UpdateSchoolRequest;
    schoolId: string;
    tx?: Prisma.TransactionClient;
  }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.update({
        where: {
          id: schoolId,
        },
        data: payload,
      });
      return school;
    } catch (error) {
      throw error;
    }
  };

  getByAccountId = async ({ accountId, tx }: { accountId: string; tx?: Prisma.TransactionClient }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.findFirst({
        where: {
          owner: {
            accountId: accountId,
          },
        },
        include: {
          logo: true,
        },
      });
      return school;
    } catch (error) {
      throw error;
    }
  };
}
