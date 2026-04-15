import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { ClassesRepo } from './classes.repo';
import { ConflictError, NotFoundError } from '@/err/customErrors';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';

export class ClassService {
  constructor(private readonly classesRepo: ClassesRepo) {}

  create = async (params: { schema: CreateClassRequest; schoolId: string }) => {
    const { schema, schoolId } = params;
    const foundClass = await this.classesRepo.findByNameAndSchoolId({ name: schema.name, schoolId });
    if (foundClass) {
      throw new ConflictError('Class already exists');
    }
    const createdClass = await this.classesRepo.create({ schema, schoolId });
    return createdClass;
  };

  update = async (params: { input: UpdateClassRequest; classId: string; schoolId: string }) => {
    const { input, classId, schoolId } = params;
    const foundClass = await this.classesRepo.findById({ classId });
    if (!foundClass) {
      throw new NotFoundError('Class not found');
    }
    if (foundClass.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'Class not found',
        internalLog: `Class with id ${classId} exists but not in school ${schoolId}`,
      });
    }
    const nameChanged = input.name !== foundClass.name;
    if (nameChanged) {
      const foundClassByName = await this.classesRepo.findByNameAndSchoolId({ name: input.name, schoolId });
      if (foundClassByName) {
        throw new ConflictError('Class with new name already exists');
      }
    }
    const updatedClass = await this.classesRepo.update({ input, classId, schoolId });
    return updatedClass;
  };
}
