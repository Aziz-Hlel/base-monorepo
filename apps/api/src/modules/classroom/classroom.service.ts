import { ClassroomRepo } from './classroom.repo';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { ClassroomMapper } from './classroom.mapper';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { UpdateClassroomRequest } from '@repo/contracts/schemas/classroom/updateClassRequest';

export class ClassroomService {
  constructor(private readonly classesRepo: ClassroomRepo) {}

  create = async (params: { input: CreateClassroomRequest; schoolId: string }) => {
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

  update = async (params: { input: UpdateClassroomRequest; classroomId: string; schoolId: string }) => {
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
