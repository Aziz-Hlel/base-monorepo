import { prisma } from '@/bootstrap/db.init';
import { ConflictError, DatabaseError, NotFoundError } from '@/err/customErrors';
import { PrismaErrorMapper } from '@/err/prismaError.mapper';
import { Prisma } from '@/generated/prisma/client';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';

export class ClassesRepo {
  create = async (params: { schema: CreateClassRequest; schoolId: string }, tx?: TX) => {
    const { schema, schoolId } = params;
    const client = tx ?? prisma;
    const createdClass = await client.class.create({
      data: {
        ...schema,
        schoolId,
      },
    });
    return createdClass;
  };

  update = async (params: { input: UpdateClassRequest; classId: string; schoolId: string }, tx?: TX) => {
    const { input, classId, schoolId } = params;
    try {
      const client = tx ?? prisma;
      const updatedClass = await client.class.update({
        where: { id: classId, schoolId },
        data: input,
      });
      return updatedClass;
    } catch (error) {
      if (!(error instanceof Error) && !(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
      if (error instanceof Error && !(error instanceof Prisma.PrismaClientKnownRequestError))
        throw new DatabaseError({ message: 'Failed to update class', cause: error });
      const mappedError = PrismaErrorMapper.map(error);
      if (mappedError.name === 'NOT_FOUND') {
        throw new NotFoundError('Class not found');
      }
      if (mappedError.name === 'CONFLICT') {
        throw new ConflictError('Class already exists');
      }
      throw new DatabaseError({ message: 'Failed to update class', cause: error });
    }
  };

  findByNameAndSchoolId = async (params: { name: string; schoolId: string }, tx?: TX) => {
    const { name, schoolId } = params;
    const client = tx ?? prisma;
    return await client.class.findUnique({
      where: {
        schoolId_name: {
          name,
          schoolId,
        },
      },
    });
  };

  findById = async (params: { classId: string }, tx?: TX) => {
    const { classId } = params;
    const client = tx ?? prisma;
    return await client.class.findUnique({
      where: { id: classId },
    });
  };
}
