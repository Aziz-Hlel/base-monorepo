import { TX } from '@/types/prisma/PrismaTransaction';
import { AssignmentRepo } from './assignment.repo';
import { prisma } from '@/bootstrap/db.init';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { Prisma } from '@/generated/prisma/client';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';

export class AssignmentService {
  constructor(private readonly repo: AssignmentRepo) {}

  syncMany = async (
    params: {
      input: { subjectId: string; teacherId: string | null }[];
      schoolId: string;
      classroomId: string;
    },
    tx?: TX,
  ) => {
    const { input, schoolId, classroomId } = params;
    const client = tx ?? prisma;
    let successCount = 0;
    let failedCount = 0;
    const failedAssignments: {
      assignment: { schoolId: string; classroomId: string; subjectId: string; teacherId: string | null };
      index: number;
      reason: 'CONFLICT' | 'OTHER';
    }[] = [];
    try {
      const bulkOperations = input.map(async (item, index) => {
        const assignment = {
          schoolId,
          classroomId,
          subjectId: item.subjectId,
          teacherId: item.teacherId,
        };
        try {
          await this.repo.upsert(assignment, client);
          successCount++;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
              failedAssignments.push({ assignment, index, reason: 'CONFLICT' });
              failedCount++;
              return;
            }
          }
          failedAssignments.push({ assignment, index, reason: 'OTHER' });
          failedCount++;
        }
      });
      await Promise.all(bulkOperations);
      return {
        successCount,
        failedCount,
        failedAssignments,
      };
    } catch (error) {
      throw error;
    }
  };

  findOrCreate = async (params: { schoolId: string; classroomId: string; subjectId: string }, tx?: TX) => {
    const { schoolId, classroomId, subjectId } = params;
    const client = tx ?? prisma;
    try {
      const assignment = await this.repo.find({ schoolId, classroomId, subjectId }, client);
      if (!assignment) {
        return await this.repo.create({ schoolId, classroomId, subjectId }, client);
      }
      return assignment;
    } catch (error) {
      throw error;
    }
  };

  assignTeacher = async (
    params: { schoolId: string; classroomId: string; subjectId: string; teacherId: string | null },
    tx?: TX,
  ) => {
    const { schoolId, classroomId, subjectId, teacherId } = params;
    const client = tx ?? prisma;
    try {
      const assignment = await this.repo.upsert({ schoolId, classroomId, subjectId, teacherId }, client);
      return assignment;
    } catch (error) {
      throw error;
    }
  };
}
