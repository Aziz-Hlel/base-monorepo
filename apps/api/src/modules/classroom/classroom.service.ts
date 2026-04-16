import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { ClassroomRepo } from './classroom.repo';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';
import { ClassroomMapper } from './classroom.mapper';
import { RepoKnownErrors } from '@/err/repo/DbError';

export class ClassroomService {
  constructor(private readonly classesRepo: ClassroomRepo) {}

  create = async (params: { input: CreateClassRequest; schoolId: string }) => {
    const { input, schoolId } = params;
    try {
      const createdClass = await this.classesRepo.create({ input, schoolId });
      const classResponse = ClassroomMapper.toResponse(createdClass);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };

  update = async (params: { input: UpdateClassRequest; classroomId: string; schoolId: string }) => {
    const { input, classroomId, schoolId } = params;
    try {
      const updatedClass = await this.classesRepo.update({ input, classroomId, schoolId });
      const classResponse = ClassroomMapper.toResponse(updatedClass);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };

  findById = async (params: { classroomId: string; schoolId: string }) => {
    const { classroomId, schoolId } = params;
    try {
      const classUnit = await this.classesRepo.findByIdAndSchoolId({ classroomId, schoolId });
      if (!classUnit) {
        throw new NotFoundError('Class not found');
      }
      const classResponse = ClassroomMapper.toResponse(classUnit);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };
}
