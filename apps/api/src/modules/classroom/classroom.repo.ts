import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';

export class ClassroomRepo {
  create = async (params: { input: CreateClassRequest; schoolId: string }, tx?: TX) => {
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
      RepoError.throwRepoError(error);
    }
  };

  update = async (params: { input: UpdateClassRequest; classroomId: string; schoolId: string }, tx?: TX) => {
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

  findByNameAndSchoolId = async (params: { name: string; schoolId: string }, tx?: TX) => {
    const { name, schoolId } = params;
    const client = tx ?? prisma;
    try {
      return await client.classroom.findUnique({
        where: {
          schoolId_name: {
            name,
            schoolId,
          },
        },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findByIdAndSchoolId = async (params: { classroomId: string; schoolId: string }, tx?: TX) => {
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

  findById = async (params: { classroomId: string }, tx?: TX) => {
    const { classroomId } = params;
    const client = tx ?? prisma;
    try {
      return await client.classroom.findUnique({
        where: { id: classroomId },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
