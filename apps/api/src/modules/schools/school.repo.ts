import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
import { CreateSchoolPayload } from './types/createSchoolPayload';
import { ConflictError } from '@/err/customErrors';
import { isUniqueConstraintError } from '@/utils/prismaError';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';

export class SchoolRepo {
  create = async ({ payload, tx }: { payload: CreateSchoolPayload; tx?: Prisma.TransactionClient }) => {
    const orm = tx ?? prisma;
    try {
      const school = await orm.school.create({
        data: payload,
      });
      return school;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (isUniqueConstraintError(error)) {
          throw new ConflictError({ message: 'School already exists', clientDisplayMessage: 'School already exists' });
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
}
