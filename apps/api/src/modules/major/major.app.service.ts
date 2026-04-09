import { ConflictError } from '@/err/customErrors';
import { CreateMajorRequest } from '@repo/contracts/schemas/major/createMajorRequest';
import { MajorService } from './major.service';
import { MajorMapper } from './major.mapper';
import { MajorEnum } from '@/generated/prisma/enums';

export class MajorAppService {
  constructor(private readonly majorService: MajorService) {}

  create = async (payload: CreateMajorRequest) => {
    const { major, type } = await this.majorService.findOrCreate(payload);
    if (type === 'EXIST') throw new ConflictError('Major already exists');
    const majorResponse = MajorMapper.toMajorResponse(major);
    return majorResponse;
  };

  findAll = async () => {
    const majors = await this.majorService.findAll();
    return majors;
  };

  findByName = async (majorName: MajorEnum) => {
    const major = await this.majorService.findByNameWithExams({ name: majorName });
    if (!major) throw new Error('Major not found');
    const majorResponse = MajorMapper.toMajorResponse(major);
    return majorResponse;
  };
}
