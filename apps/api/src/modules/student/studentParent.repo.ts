import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { TX } from '@/types/prisma/PrismaTransaction';

export class StudentParentRepo {
  assignParentToStudent = async (
    { studentId, parentId, schoolId }: { studentId: string; parentId: string; schoolId: string },
    tx?: TX,
  ) => {
    const client = tx ?? prisma;
    try {
      const createdStudentParent = await client.studentParents.create({
        data: {
          student: {
            connect: {
              id: studentId,
              schoolId,
            },
          },
          parent: {
            connect: {
              id: parentId,
              user: {
                schoolId,
              },
            },
          },
        },
      });
      return createdStudentParent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  unassignParentFromStudent = async ({ studentId, parentId }: { studentId: string; parentId: string }, tx?: TX) => {
    const client = tx ?? prisma;
    try {
      return await client.studentParents.delete({
        where: {
          parentId_studentId: {
            studentId,
            parentId,
          },
        },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findByStudentIdAndParentId = async ({ studentId, parentId }: { studentId: string; parentId: string }, tx?: TX) => {
    const client = tx ?? prisma;
    try {
      return await client.studentParents.findUnique({
        where: {
          parentId_studentId: {
            studentId,
            parentId,
          },
        },
      });
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
