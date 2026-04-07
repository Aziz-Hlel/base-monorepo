import { MajorEnum } from '@/generated/prisma/enums';
import { MajorRepo } from './major.repo';
import { MajorInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export class MajorService {
  constructor(private readonly majorRepo: MajorRepo) {}

  create = async (name: MajorEnum) => {
    return await this.majorRepo.create(name);
  };

  findOrCreate = async (name: MajorEnum) => {
    const major = await this.majorRepo.findByName(name);
    if (major) return major;
    return await this.majorRepo.create(name);
  };

  findAll = async <T extends MajorInclude<DefaultArgs>>({ include }: { include: T }) => {
    return await this.majorRepo.findAll({ include });
  };
}
