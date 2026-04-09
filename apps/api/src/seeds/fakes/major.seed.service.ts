import { MajorEnum } from '@/generated/prisma/enums';
import { MajorService } from '@/modules/major/major.service';

export class MajorSeedService {
  constructor(private readonly majorService: MajorService) {}

  run = async ({ majorName }: { majorName: MajorEnum }) => {
    const major = await this.majorService.findOrCreate({
      name: majorName,
    });
    return major;
  };
}
