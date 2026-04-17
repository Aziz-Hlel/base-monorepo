import { RepoKnownErrors } from '@/err/repo/DbError';
import { StudentParentRepo } from './studentParent.repo';

export class StudentParentService {
  constructor(private readonly studentParentRepo: StudentParentRepo) {}

  assignParent = async (params: { studentId: string; parentId: string; schoolId: string }) => {
    const { studentId, parentId, schoolId } = params;
    const existingStudentParent = await this.studentParentRepo.findByStudentIdAndParentId({ studentId, parentId });
    if (existingStudentParent) return;
    try {
      await this.studentParentRepo.assignParentToStudent({ studentId, parentId, schoolId });
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) return;
      throw error;
    }
  };

  unassignParent = async (params: { studentId: string; parentId: string; schoolId: string }) => {
    const { studentId, parentId, schoolId } = params;
    const existingStudentParent = await this.studentParentRepo.findByStudentIdAndParentId({ studentId, parentId });
    if (!existingStudentParent) return;
    try {
      await this.studentParentRepo.unassignParentFromStudent({ studentId, parentId });
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) return;
      throw error;
    }
  };
}
