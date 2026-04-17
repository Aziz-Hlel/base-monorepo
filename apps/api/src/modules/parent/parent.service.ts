import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { ParentRepo } from './parent.repo';
import { RepoKnownErrors } from '@/err/repo/DbError';

export class ParentService {
  constructor(private readonly parentRepo: ParentRepo) {}

  create = async (params: { input: { emergencyPhone: string }; userId: string; schoolId: string }) => {
    try {
      const createdParent = await this.parentRepo.create(params);
      return createdParent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Parent already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };

  update = async (params: { input: { emergencyPhone: string }; parentId: string; schoolId: string }) => {
    try {
      const updatedParent = await this.parentRepo.update(params);
      return updatedParent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };

  getByIdAndSchoolId = async (params: { parentId: string; schoolId: string }) => {
    try {
      const parent = await this.parentRepo.getByIdAndSchoolId(params);
      return parent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };
}
