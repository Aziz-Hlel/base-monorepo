import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';
import { ClassRepo } from './class.repo';

export class ClassService {
  constructor(private readonly classRepo: ClassRepo) {}

  create = async (data: CreateClassRequest, schoolId: string) => {
    return await this.classRepo.create(data, schoolId);
  };

  getBySchoolId = async (schoolId: string) => {
    return await this.classRepo.getBySchoolId(schoolId);
  };

  getById = async (id: string) => {
    return await this.classRepo.getById(id);
  };

  update = async (data: UpdateClassRequest, id: string) => {
    return await this.classRepo.update(data, id);
  };

  delete = async (id: string) => {
    return await this.classRepo.delete(id);
  };
}
