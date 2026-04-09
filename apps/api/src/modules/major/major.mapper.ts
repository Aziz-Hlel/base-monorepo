import { Major } from '@/generated/prisma/client';
import { MajorResponse } from '@repo/contracts/schemas/major/majorResponse';

export class MajorMapper {
  static toMajorResponse(major: Major): MajorResponse {
    return {
      id: major.id,
      name: major.name,
    };
  }
}
