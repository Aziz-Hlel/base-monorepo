import { MajorEnum } from '@/generated/prisma/enums';
import { MajorService } from './major.service';

export class MajorAppService {
  constructor(private readonly majorService: MajorService) {}

  create = async (name: MajorEnum) => {
    return await this.majorService.create(name);
  };

  findAll = async () => {
    return await this.majorService.findAll({ include: { exams: true } });
  };
}
