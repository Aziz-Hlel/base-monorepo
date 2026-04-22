import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { UpdateClassroomRequest } from '@repo/contracts/schemas/classroom/updateClassRequest';

export class ClassroomRepo {
  create = async (params: { input: CreateClassroomRequest; schoolId: string }, tx?: TX) => {
    try {
      const { input, schoolId } = params;
      const client = tx ?? prisma;
      const createdClass = await client.classroom.create({
        data: {
          ...input,
          schoolId,
        },
      });
      return createdClass;
    } catch (error) {
      RepoError_V2.handleRepoError(error);
    }
  };

  update = async (params: { input: UpdateClassroomRequest; classroomId: string; schoolId: string }, tx?: TX) => {
    const { input, classroomId, schoolId } = params;
    try {
      const client = tx ?? prisma;
      const updatedClass = await client.classroom.update({
        where: { id: classroomId, schoolId },
        data: input,
      });
      return updatedClass;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  find = async (params: { classroomId: string; schoolId: string }, tx?: TX) => {
    const { classroomId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      return await client.classroom.findUnique({
        where: { id: classroomId, schoolId },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
