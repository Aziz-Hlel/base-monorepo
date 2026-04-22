import { TX } from '@/types/prisma/PrismaTransaction';
import { AssignmentRepo } from './assignment.repo';
import { prisma } from '@/bootstrap/db.init';
import { BadRequestError } from '@/err/service/customErrors';

export class AssignmentInternal {
  constructor(private readonly repo: AssignmentRepo) {}

  createMany = async (params: { schoolId: string; classroomId: string; subjectId: string }[], tx?: TX) => {
    const client = tx ?? prisma;
    try {
      const createdAssignments = await this.repo.createMany(params, client);
      return createdAssignments;
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      throw new BadRequestError({ message: 'Failed to create assignments', cause: error });
    }
  };
}
