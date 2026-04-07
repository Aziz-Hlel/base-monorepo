import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/customErrors';
import { MajorEnum } from '@/generated/prisma/enums';
import { MajorGetPayload, MajorInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export class MajorRepo {
  create = async (name: MajorEnum) => {
    try {
      return await prisma.major.create({
        data: {
          name,
        },
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Failed to create major',
        clientMessage: 'Failed to create major',
        cause: error,
      });
    }
  };

  findByName = async (name: MajorEnum) => {
    try {
      return await prisma.major.findUnique({
        where: {
          name,
        },
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find major by name',
        cause: error,
      });
    }
  };

  findAll = async <T extends MajorInclude<DefaultArgs>>({ include }: { include: T }) => {
    try {
      const a = await prisma.major.findMany({
        include: include,
      });
      return a;
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find majors',
        cause: error,
      });
    }
  };
}
