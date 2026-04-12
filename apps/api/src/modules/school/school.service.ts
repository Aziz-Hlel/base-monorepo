import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { UserAppService } from '../User/Service/user.app.service';
import { SchoolRepo } from './school.repo';

export class SchoolService {
  constructor(private readonly schoolRepo: SchoolRepo) {}

  create = async (data: CreateSchoolRequest, userId: string) => {
    const school = await this.schoolRepo.create(data, userId, { include: {} });

    return school;
  };

  findById = async (schoolId: string) => {
    const school = await this.schoolRepo.getById(schoolId);

    return school;
  };

  findByUserId = async (userId: string) => {
    const school = await this.schoolRepo.getByUserId(userId);

    return school;
  };

  findOrCreateByUserId = async (userId: string, data: CreateSchoolRequest) => {
    const existingSchool = await this.findByUserId(userId);

    if (existingSchool) {
      return { school: existingSchool, type: 'EXISTING' };
    }
    const createdSchool = await this.create(data, userId);

    return { school: createdSchool, type: 'NEW' };
  };

  update = async (data: UpdateSchoolRequest, schoolId: string) => {
    const school = await this.schoolRepo.update(data, schoolId);

    return school;
  };
}
