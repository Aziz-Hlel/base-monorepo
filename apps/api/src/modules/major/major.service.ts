import { MajorEnum } from '@/generated/prisma/enums';
import { MajorRepo } from './major.repo';
import { MajorInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateMajorRequest } from '@repo/contracts/schemas/major/createMajorRequest';

export class MajorService {
  constructor(private readonly majorRepo: MajorRepo) {}

  create = async (name: MajorEnum) => {
    return await this.majorRepo.create(name);
  };

  findOrCreate = async (payload: CreateMajorRequest) => {
    const major = await this.majorRepo.findByName({ payload, include: {} });
    if (major) return { major, type: 'EXIST' };
    const newMajor = await this.majorRepo.create(payload.name);
    return { major: newMajor, type: 'NEW' };
  };

  findAll = async () => {
    return await this.majorRepo.findAll({ include: {} });
  };

  findAllWithExams = async () => {
    return await this.majorRepo.findAll({ include: { exams: true } });
  };

  findByName = async (payload: CreateMajorRequest) => {
    return await this.majorRepo.findByName({ payload, include: {} });
  };

  findByNameWithExams = async (payload: CreateMajorRequest) => {
    return await this.majorRepo.findByName({ payload, include: { exams: true } });
  };

  existsByName = async (payload: CreateMajorRequest) => {
    const major = await this.majorRepo.findByName({ payload, include: {} });
    return !!major;
  };
}
