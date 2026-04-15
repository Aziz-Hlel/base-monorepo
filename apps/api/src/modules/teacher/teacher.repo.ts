import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/customErrors';
import { Prisma } from '@/generated/prisma/client';

export class TeacherRepo {
  create = async ({ userId }: { userId: string }, tx?: Prisma.TransactionClient) => {
    try {
      const client = tx ?? prisma;
      return await client.teacher.create({
        data: {
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to create teacher', cause: error });
      }
      throw error;
    }
  };

  findById = async <T extends Prisma.TeacherInclude | {}>(
    { id }: { id: string },
    params: { include: T } = { include: {} as T },
  ) => {
    try {
      return await prisma.teacher.findUnique({
        where: { id },
        include: params.include,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find teacher', cause: error });
      }
      throw error;
    }
  };

  findByUserId = async <T extends Prisma.TeacherInclude>(
    { userId }: { userId: string },
    { include }: { include: T } = { include: {} as T },
  ) => {
    try {
      return await prisma.teacher.findUnique({
        where: {
          userId,
        },
        include,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find teacher', cause: error });
      }
      throw error;
    }
  };
}
